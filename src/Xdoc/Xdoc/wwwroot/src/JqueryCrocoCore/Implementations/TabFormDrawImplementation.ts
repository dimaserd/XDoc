class TabFormDrawImplementation implements IFormDraw {
    

    constructor(model: GenerateGenericUserInterfaceModel) {
        this._model = model;
        this._drawHelper = new HtmlSelectDrawHelper(CrocoAppCore.Application.FormDataHelper.NullValue);
    }

    _drawHelper: HtmlSelectDrawHelper;
    _model: GenerateGenericUserInterfaceModel;
    _datePickerPropNames: Array<string> = [];

    _selectClass = 'form-draw-select';

    

    BeforeFormDrawing(): void {
        //TODO Init calendar or some scripts
    }
    AfterFormDrawing(): void {
        //Красивые селекты
        $(`.${this._selectClass}`).selectpicker('refresh');

        //Иницилизация календарей
        for (let i = 0; i < this._datePickerPropNames.length; i++) {
            const datePickerPropName = this._datePickerPropNames[i];

            FormDrawImplementation.InitCalendarForPrefixedProperty(this._model.Prefix, datePickerPropName);
        }
    }

    RenderTextBox(typeDescription: CrocoTypeDescription): string {

        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);

        return `<div class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">
                        ${typeDescription.PropertyDescription.PropertyDisplayName}:
                    </label>
                    <div class="col-xl-9 col-lg-9">
                        <div class="input-group">
                            <input type="text" name="${this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName)}" class="form-control m-input" placeholder="" value="${value}">
                        </div>
                    </div>
                </div>`;
    }
    RenderTextArea(typeDescription: CrocoTypeDescription): string {

        var value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);

        return `<div class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">${typeDescription.PropertyDescription.PropertyDisplayName}</label>
                    <div class="col-xl-9 col-lg-9">
                        <textarea class="form-control m-input" name="${this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName)}" rows="3">${value}</textarea>
                    </div>
                </div>`;
    }

    RenderGenericDropList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], isMultiple: boolean): string {

        let rawValue = ValueProviderHelper.GetRawValueFromValueProvider(typeDescription, this._model.ValueProvider);

        this._drawHelper.ProccessSelectValues(typeDescription, rawValue, selectList);

        const _class = `${this._selectClass} form-control m-input m-bootstrap-select m_selectpicker`;

        let dict = isMultiple ? new Map<string, string>().set("multiple", "") : null;

        var select = HtmlDrawHelper.RenderSelect(_class, this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName), selectList, dict);

        return `<div class="form-group m-form__group row">
                    <label class="col-xl-3 col-lg-3 col-form-label">${typeDescription.PropertyDescription.PropertyDisplayName}:</label>
                    <div class="col-xl-9 col-lg-9">
                        ${select}
                    </div>
                </div>`;
    }


    RenderDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[]): string {

        return this.RenderGenericDropList(typeDescription, selectList, false);
    }

    RenderMultipleDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[]): string {

        return this.RenderGenericDropList(typeDescription, selectList, true);
    }

    RenderHidden(typeDescription: CrocoTypeDescription): string {
        let value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);

        return `<input type="hidden" name="${this.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName)}" value="${value}">`;
    }
    RenderDatePicker(typeDescription: CrocoTypeDescription): string {
        this._datePickerPropNames.push(typeDescription.PropertyDescription.PropertyName);

        return this.RenderTextBox(typeDescription);
    }

    private GetPropertyValueName(propName: string): string {
        return `${this._model.Prefix}${propName}`;
    }
}