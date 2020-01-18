﻿class ModalWorker implements IModalWorker {

    

    /**
     * идентификатор модального окна с загрузочной анимацией
     */
    static LoadingModal: string = "loadingModal";

    /** Показать модальное окно по идентификатору. */
    public ShowModal(modalId: string): void {

        if (modalId === "" || modalId == null || modalId == undefined) {
            modalId = ModalWorker.LoadingModal;
        }

        $(`#${modalId}`).modal('show');
    }

    public ShowLoadingModal(): void {
        this.ShowModal(ModalWorker.LoadingModal);
    }

    public HideModals(): void {

        $('.modal').modal('hide');

        $(".modal-backdrop.fade").remove();

        $('.modal').on('shown.bs.modal', () => {
        })
    }

    public HideModal(modalId: string): void {
        $(`#${modalId}`).modal('hide');
    }
}