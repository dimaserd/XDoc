class GenericInterfaceAppHelper {

    constructor() {
        this.FormHelper = new GenericForm({ FormDrawFactory: CrocoAppCore.GetFormDrawFactory() })
    }

    FormHelper: GenericForm;

    /**
     * Получить модель для построения обобщенного пользовательского интерфейса
     * @param typeName Полное или сокращенное название класса C#
     * @param modelPrefix Префикс для построения модели
     * @param callBack Функция, которая вызовется когда модель будет получена с сервера
     */
    GetUserInterfaceModel(typeName: string, modelPrefix: string, callBack: (x: GenerateGenericUserInterfaceModel) => void): void {

        const data = { typeName: typeName, modelPrefix: modelPrefix };

        CrocoAppCore.Application.Requester.Post("/Api/Documentation/GenericInterface", data,
            (x: GenerateGenericUserInterfaceModel) => {
                if (x == null) {
                    alert(`Обобщенный интерфейс с названием '${typeName}' не пришёл с сервера`);
                    return;
                }

                callBack(x);
            },
            () => {
                const mes = `Произошла ошибка при поиске обобщенного интерфейса по типу ${typeName}`;

                alert(mes);
                CrocoAppCore.Application.Logger.LogAction(mes, "", "GenericInterfaceAppHelper.GetUserInterfaceModel.ErrorOnRequest", JSON.stringify(data));
            })
    }

    /**
     * Получить модель для построения обобщенного пользовательского интерфейса
     * @param enumTypeName Полное или сокращенное название перечисления в C#
     * @param callBack Функция, которая вызовется когда модель будет получена с сервера
     */
    GetEnumModel(enumTypeName: string, callBack: (x: CrocoEnumTypeDescription) => void): void {

        const data = { typeName: enumTypeName };

        CrocoAppCore.Application.Requester.Post("/Api/Documentation/EnumType", data,
            (x: CrocoEnumTypeDescription) => {
                if (x == null) {
                    alert(`Перечисление с названием '${enumTypeName}' не пришло с сервера`);
                    return;
                }

                callBack(x);
            },
            () => {
                const mes = `Произошла ошибка при поиске перечеисления с названием ${enumTypeName}`;

                alert(mes);
                CrocoAppCore.Application.Logger.LogAction(mes, "", "GenericInterfaceAppHelper.GetEnumModel.ErrorOnRequest", JSON.stringify(data));
            })
    }
}