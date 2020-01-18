interface IGenericFormOptions {
    FormDrawFactory: FormDrawFactory;
}

class GenericForm {

    _formDrawFactory: FormDrawFactory;

    constructor(opts: IGenericFormOptions) {

        if (opts.FormDrawFactory == null) {
            GenericForm.ThrowError("Фабрика реализаций отрисовки обобщенных форм == null. Проверьте заполнение свойства opts.FormDrawFactory")
        }

        this._formDrawFactory = opts.FormDrawFactory;
    }

    _genericInterfaces: Array<RenderGenericInterface> = [];

    static UnWrapModel(model: GenerateGenericUserInterfaceModel, drawer: FormTypeDrawer) : string {

        let html = "";

        for (let i = 0; i < model.Blocks.length; i++) {
            let block = model.Blocks[i];

            switch (block.InterfaceType) {
                case UserInterfaceType.TextBox:
                    html += drawer.TextBoxFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.TextArea:
                    html += drawer.TextAreaFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.DropDownList:
                    html += drawer.DropDownFor(block.PropertyName, block.SelectList, true);
                    break;
                case UserInterfaceType.Hidden:
                    html += drawer.HiddenFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.DatePicker:
                    html += drawer.DatePickerFor(block.PropertyName, true);
                    break;
                case UserInterfaceType.MultipleDropDownList:
                    html += drawer.MultipleDropDownFor(block.PropertyName, block.SelectList, true);
                    break;
                default:
                    console.log("Данный блок не реализован", block);
                    throw new Error("Не реализовано");
            }
        }

        return html;
    }

    static ThrowError(mes: string): void {
        alert(mes);
        throw Error(mes);
    }

    /*
     * Отрисовать все формы, которые имеются на экране
     * */
    DrawForms() : void {

        var elems = document.getElementsByClassName("generic-user-interface");

        for (let i = 0; i < elems.length; i++) {
            this.FindFormAndSave(elems[i]);
        }

        for (let i = 0; i < this._genericInterfaces.length; i++) {
            this.DrawForm(this._genericInterfaces[i]);
        }
    }

    FindFormAndSave(elem: Element): void {
        var id = elem.getAttribute("data-id");

        var buildModel = window[id] as GenerateGenericUserInterfaceModel;

        if (buildModel == null) {
            return;
        }

        if (elem.id == null) {
            console.log(elem);
            GenericForm.ThrowError(`На странице имеются элементы с настройками для генерации обобщенного интерфейса, но у элемента нет идентификатора`);
        }

        this._genericInterfaces.push({
            ElementId: elem.id,
            FormDrawKey: "", //TODO Сделать получение ключа для отрисовки
            FormModel: buildModel
        });

        window[id] = null;
    }

    DrawForm(renderModel: RenderGenericInterface): void {
        
        var drawImpl = this._formDrawFactory.GetImplementation(renderModel.FormModel, renderModel.FormDrawKey);

        var drawer = new FormTypeDrawer(drawImpl, renderModel.FormModel.TypeDescription);

        drawer.BeforeFormDrawing();

        var elem = document.getElementById(renderModel.ElementId);

        if (elem == null) {
            GenericForm.ThrowError(`Элемент с идентификатором ${renderModel.ElementId} не найден на странице`);
        }

        elem.innerHTML = GenericForm.UnWrapModel(renderModel.FormModel, drawer);

        drawer.AfterFormDrawing();
    }
}