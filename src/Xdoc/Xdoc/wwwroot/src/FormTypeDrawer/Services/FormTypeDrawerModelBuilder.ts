class FormTypeDrawerModelBuilder {
    _model: GenerateGenericUserInterfaceModel;

    constructor(model: GenerateGenericUserInterfaceModel) {
        this._model = model;
    }

    public SetMultipleDropDownListFor(propertyName: string, selectListItems: Array<SelectListItem>): FormTypeDrawerModelBuilder {

        let block = this.GetPropertyBlockByName(propertyName);

        block.InterfaceType = UserInterfaceType.MultipleDropDownList;
        block.SelectList = selectListItems;

        this.ResetBlock(block);
        return this;
    }

    public SetDropDownListFor(propertyName: string, selectListItems: Array<SelectListItem>): FormTypeDrawerModelBuilder {
        let block = this.GetPropertyBlockByName(propertyName);

        block.InterfaceType = UserInterfaceType.DropDownList;
        block.SelectList = selectListItems;

        this.ResetBlock(block);
        return this;
    }

    public SetTextAreaFor(propertyName: string): FormTypeDrawerModelBuilder {
        var block = this.GetPropertyBlockByName(propertyName);

        if (block.InterfaceType != UserInterfaceType.TextBox) {
            throw new Error(`Только элементы с типом ${UserInterfaceType.TextBox} можно переключать на ${UserInterfaceType.TextArea}`);
        }

        block.InterfaceType = UserInterfaceType.TextArea;

        this.ResetBlock(block);
        return this;
    }

    public SetHiddenFor(propertyName: string): FormTypeDrawerModelBuilder {
        let block = this.GetPropertyBlockByName(propertyName);

        block.InterfaceType = UserInterfaceType.Hidden;

        this.ResetBlock(block);
        return this;
    }

    private ResetBlock(block: UserInterfaceBlock): void {
        let index = this._model.Blocks.findIndex(x => x.PropertyName == block.PropertyName);

        this._model.Blocks[index] = block;
    }

    private GetPropertyBlockByName(propertyName: string): UserInterfaceBlock {
        let block = this._model.Blocks.find(x => x.PropertyName == propertyName);

        if (block == null) {
            throw new Error(`Блок не найден по указанному имени ${propertyName}`);
        }

        return block;
    }
}