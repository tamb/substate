function fyiModal(ref) {
    const $infoModal = $('.js-fyi-modal');
    const $noShow = $('.js-fyi-modal__no-show');

    $(function() {
        if (ref.State.getProp('showFYIModal')) {
            $infoModal.modal('show');
        }

        $noShow.on('click', function() {
            ref.Element.emit('FYI_NOSHOW_CLICKED', false);
        });
    });
}

export default fyiModal;