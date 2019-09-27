import { mergeStores } from "substate";

import "./styles.css";
import wireForm from "./form/form";
import wireList from "./list/list";
import listStore from "./list/listState";
import formStore from "./form/formState";
wireForm();
wireList();

const store = mergeStores([listStore, formStore], {
  name: "mergedStore"
});

console.log(store);
