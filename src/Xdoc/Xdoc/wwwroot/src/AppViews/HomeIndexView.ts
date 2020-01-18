class HomeIndexView {
    constructor() {
        this.SetHandlers();
    }

    public SetHandlers(): void {
        CrocoAppCore.GenericInterfaceHelper.GetUserInterfaceModel("RussianFederationPassportModel", "somePrefix", x => {
            
            //Метод отрисовки
            CrocoAppCore.GenericInterfaceHelper.FormHelper.DrawForm({
                ElementId: "form-id", //Идентификатор элемента, куда будет вставлена разметка с интерфейсом
                FormDrawKey: null, //Ключ по-которому указывается тип отрисовки (если null, то берётся по-умолчанию)
                FormModel: x //Передаю модель описывающую сам интерфейс
            });
        });
    }
}
new HomeIndexView();