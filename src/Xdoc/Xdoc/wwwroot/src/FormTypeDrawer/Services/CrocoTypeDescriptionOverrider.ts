class CrocoTypeDescriptionOverrider {

    static FindUserInterfacePropBlockByPropertyName(model: GenerateGenericUserInterfaceModel, propertyName: string) {
        var prop = model.Blocks.find(x => x.PropertyName === propertyName);
        if (prop == null) {
            alert(`Свойство '${propertyName}' не найдено в модели обобщенного пользоватлеьского интерфейса`);
            return;
        }

        return prop;
    }

    static SetUserInterfaceTypeForProperty(model: GenerateGenericUserInterfaceModel, propertyName: string, interfaceType: UserInterfaceType) {
        var prop = CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName);
        prop.InterfaceType = interfaceType;
    }

    static RemoveProperty(model: GenerateGenericUserInterfaceModel, propertyName: string): void {
        model.Blocks = model.Blocks.filter(x => x.PropertyName !== propertyName);
    }

    /**
     * Установить текстовый лейбл для имени свойста
     * @param model модель для свойства которой нужно установить лейбл
     * @param propertyName  название свойства
     * @param labelText текст лейбла для заданного свойства
     */
    static SetLabelText(model: GenerateGenericUserInterfaceModel, propertyName: string, labelText: string): void {
        CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName).LabelText = labelText;
    }

    /**
     * Установить для свойства модели тип пользовательского интрефейса скрытый инпут
     * @param model модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     */
    static SetHidden(model: GenerateGenericUserInterfaceModel, propertyName: string): void {
        CrocoTypeDescriptionOverrider.SetUserInterfaceTypeForProperty(model, propertyName, UserInterfaceType.Hidden);
    }

    /**
     *  Установить для свойства модели тип пользовательского интерфейса textarea (большой текстовый инпут)
     * @param model  модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     */
    static SetTextArea(model: GenerateGenericUserInterfaceModel, propertyName: string): void {
        CrocoTypeDescriptionOverrider.SetUserInterfaceTypeForProperty(model, propertyName, UserInterfaceType.TextArea);
    }

    /**
     *  Установить для свойства модели тип пользовательского интерфейса выпадающий список
     * @param model  модель для которой нужно поменять тип интерфейса для свойства
     * @param propertyName имя свойства
     * @param selectList  данные для построения выпадающего списка
     */
    static SetDropDownList(model: GenerateGenericUserInterfaceModel, propertyName: string, selectList: SelectListItem[]): void {
        var prop = CrocoTypeDescriptionOverrider.FindUserInterfacePropBlockByPropertyName(model, propertyName);

        prop.InterfaceType = UserInterfaceType.DropDownList;
        prop.SelectList = selectList;
    }
}