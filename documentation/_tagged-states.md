## 🏷️ Tagged States - Named State Checkpoint System

Tagged states is a **Named State Checkpoint System** that allows you to create semantic, named checkpoints in your application's state history. Instead of navigating by numeric indices, you can jump to meaningful moments in your app's lifecycle.

### What is a Named State Checkpoint System?

A Named State Checkpoint System provides:
- **Semantic Navigation**: Jump to states by meaningful names instead of numbers
- **State Restoration**: Restore to any named checkpoint and continue from there
- **Debugging Support**: Tag known-good states for easy rollback
- **User Experience**: Enable features like "save points" and "undo to specific moment"

### Basic Usage

```typescript
import { createStore } from 'substate';

const gameStore = createStore({
  name: 'GameStore',
  state: { level: 1, score: 0, lives: 3 }
});

// Create tagged checkpoints with meaningful names
gameStore.updateState({ 
  level: 5, 
  score: 1250, 
  $tag: "level-5-start" 
});

gameStore.updateState({ 
  level: 10, 
  score: 5000, 
  lives: 2, 
  $tag: "boss-fight" 
});

// Jump back to any tagged state by name
gameStore.jumpToTag("level-5-start");
console.log(gameStore.getCurrentState()); // { level: 5, score: 1250, lives: 3 }

// Access tagged states without changing current state
const bossState = gameStore.getTaggedState("boss-fight");
console.log(bossState); // { level: 10, score: 5000, lives: 2 }

// Manage your tags
console.log(gameStore.getAvailableTags()); // ["level-5-start", "boss-fight"]
gameStore.removeTag("level-5-start");
```

### Advanced Checkpoint Patterns

#### Form Wizard with Step Restoration

```typescript
const formStore = createStore({
  name: 'FormWizard',
  state: {
    currentStep: 1,
    personalInfo: { firstName: '', lastName: '', email: '' },
    addressInfo: { street: '', city: '', zip: '' },
    paymentInfo: { cardNumber: '', expiry: '' }
  }
});

// Save progress at each completed step
function completePersonalInfo(data) {
  formStore.updateState({
    personalInfo: data,
    currentStep: 2,
    $tag: "step-1-complete"
  });
}

function completeAddressInfo(data) {
  formStore.updateState({
    addressInfo: data,
    currentStep: 3,
    $tag: "step-2-complete"
  });
}

// User can jump back to any completed step
function goToStep(stepNumber) {
  const stepTag = `step-${stepNumber}-complete`;
  if (formStore.getAvailableTags().includes(stepTag)) {
    formStore.jumpToTag(stepTag);
  }
}

// Usage
goToStep(1); // Jump back to personal info step
goToStep(2); // Jump back to address info step
```

#### Debugging and Error Recovery

```typescript
const appStore = createStore({
  name: 'AppStore',
  state: {
    userData: null,
    settings: {},
    lastError: null
  }
});

// Tag known good states for debugging
function markKnownGoodState() {
  appStore.updateState({
    $tag: "last-known-good"
  });
}

// When errors occur, jump back to known good state
function handleError(error) {
  console.error('Error occurred:', error);
  
  if (appStore.getAvailableTags().includes("last-known-good")) {
    console.log('Rolling back to last known good state...');
    appStore.jumpToTag("last-known-good");
  }
}

// Tag states before risky operations
function performRiskyOperation() {
  appStore.updateState({
    $tag: "before-risky-operation"
  });
  
  // ... perform operation that might fail
  
  if (operationFailed) {
    appStore.jumpToTag("before-risky-operation");
  }
}
```

#### Game Save System

```typescript
const gameStore = createStore({
  name: 'GameStore',
  state: {
    player: { health: 100, level: 1, inventory: [] },
    world: { currentArea: 'town', discoveredAreas: [] },
    quests: { active: [], completed: [] }
  }
});

// Auto-save system
function autoSave() {
  const timestamp = new Date().toISOString();
  gameStore.updateState({
    $tag: `auto-save-${timestamp}`
  });
}

// Manual save system
function manualSave(saveName) {
  gameStore.updateState({
    $tag: `save-${saveName}`
  });
}

// Load save system
function loadSave(saveName) {
  const saveTag = `save-${saveName}`;
  if (gameStore.getAvailableTags().includes(saveTag)) {
    gameStore.jumpToTag(saveTag);
    return true;
  }
  return false;
}

// Get all available saves
function getAvailableSaves() {
  return gameStore.getAvailableTags()
    .filter(tag => tag.startsWith('save-'))
    .map(tag => tag.replace('save-', ''));
}

// Usage
manualSave("checkpoint-1");
manualSave("before-boss-fight");
loadSave("checkpoint-1");
```

#### Feature Flag and A/B Testing

```typescript
const experimentStore = createStore({
  name: 'ExperimentStore',
  state: {
    features: {},
    userGroup: null,
    experimentResults: {}
  }
});

// Tag different experiment variants
function setupExperimentVariant(variant) {
  experimentStore.updateState({
    userGroup: variant,
    $tag: `experiment-${variant}`
  });
}

// Jump between experiment variants
function switchToVariant(variant) {
  const variantTag = `experiment-${variant}`;
  if (experimentStore.getAvailableTags().includes(variantTag)) {
    experimentStore.jumpToTag(variantTag);
  }
}

// Usage
setupExperimentVariant("control");
setupExperimentVariant("variant-a");
setupExperimentVariant("variant-b");

switchToVariant("variant-a"); // Switch to variant A
```

### 🎯 Common Tagging Patterns

```typescript
// Form checkpoints
formStore.updateState({ ...formData, $tag: "before-validation" });

// API operation snapshots  
store.updateState({ users: userData, $tag: "after-user-import" });

// Feature flags / A-B testing
store.updateState({ features: newFeatures, $tag: "experiment-variant-a" });

// Debugging checkpoints
store.updateState({ debugInfo: data, $tag: "issue-reproduction" });

// Game saves
gameStore.updateState({ saveData, $tag: `save-${Date.now()}` });

// Workflow states
workflowStore.updateState({ status: "approved", $tag: "workflow-approved" });

// User session states
sessionStore.updateState({ user: userData, $tag: "user-logged-in" });
```
