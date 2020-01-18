class FormDrawImplementation implements IFormDraw {

    _htmlDrawHelper: HtmlSelectDrawHelper;

    constructor(model: GenerateGenericUserInterfaceModel) {
        this._model = model;
        this._htmlDrawHelper = new HtmlSelectDrawHelper(CrocoAppCore.Application.FormDataHelper.NullValue);
    }

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

    GetPropertyName(propName: string) {
        return FormDrawHelper.GetPropertyValueName(propName, this._model.Prefix);
    }

    GetPropertyBlock(propertyName: string): UserInterfaceBlock {
        return this._model.Blocks.find(x => x.PropertyName === propertyName);
    } 

    static GetElementIdForFakeCalendar(modelPrefix:string,  propName: string): string {
        let result = `${modelPrefix}_${propName}FakeCalendar`;

        //в айдишниках не поддерживаются точки поэтому их все заменяю на нижние подчеркивания
        return result.replace(new RegExp(/\./, 'g'), '_');
    }

    static GetElementIdForRealCalendarBackProperty(modelPrefix: string, propName: string): string {
        let result = `${modelPrefix}_${propName}RealCalendar`;

        //в айдишниках не поддерживаются точки поэтому их все заменяю на нижние подчеркивания
        return result.replace(new RegExp(/\./, 'g'), '_');
    }

    static InitCalendarForPrefixedProperty(modelPrefix: string, propName: string): void {
        
        let calandarElementId = FormDrawImplementation.GetElementIdForFakeCalendar(modelPrefix, propName);
        let backPropElementId = FormDrawImplementation.GetElementIdForRealCalendarBackProperty(modelPrefix, propName);

        DatePickerUtils.SetDatePicker(calandarElementId, backPropElementId);
    }

    GetPropValue(typeDescription: CrocoTypeDescription) : string {
        return ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);
    }

    RenderDatePicker(typeDescription: CrocoTypeDescription, wrap: boolean): string {
        let propName = typeDescription.PropertyDescription.PropertyName;

        let renderPropName = this.GetPropertyName(propName);

        this._datePickerPropNames.push(propName);

        let id = FormDrawImplementation.GetElementIdForFakeCalendar(this._model.Prefix, propName);

        let hiddenProps = new Map<string, string>()
            .set("id", FormDrawImplementation.GetElementIdForRealCalendarBackProperty(this._model.Prefix, propName))
            .set(CrocoAppCore.Application.FormDataHelper.DataTypeAttributeName, CSharpType.String.toString());

        return this.RenderTextBoxInner(typeDescription, wrap, id, `${renderPropName}Fake`)
            + FormDrawHelper.GetInputTypeHidden(renderPropName, "", hiddenProps);
    }

    RenderHidden(typeDescription: CrocoTypeDescription, wrap: boolean): string {
        const value = this.GetPropValue(typeDescription);

        const html = FormDrawHelper.GetInputTypeHidden(FormDrawHelper.GetPropertyValueName(typeDescription.PropertyDescription.PropertyName, this._model.Prefix), value, null);

        return html;
    }

    RenderTextBox(typeDescription: CrocoTypeDescription, wrap: boolean): string {

        return this.RenderTextBoxInner(typeDescription, wrap, null, this.GetPropertyName(typeDescription.PropertyDescription.PropertyName));
    }

    RenderTextBoxInner(typeDescription: CrocoTypeDescription, wrap: boolean, id: string, propName: string): string {

        const value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);

        const idAttr = id == null ? "" : ` id="${id}"`;

        let propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);

        const cSharpType = propBlock.TextBoxData?.IsInteger ? CSharpType.Int : CSharpType.String;

        const dataTypeAttr = `${CrocoAppCore.Application.FormDataHelper.DataTypeAttributeName}=${cSharpType.toString()}`;

        const typeAndStep = propBlock.TextBoxData.IsInteger ? `type="number" step="${propBlock.TextBoxData.IntStep}"` : `type="text"`;

        const html = `<label for="${typeDescription.PropertyDescription.PropertyName}">${propBlock.LabelText}</label>
                <input${idAttr} autocomplete="off" class="form-control m-input" name="${propName}" ${dataTypeAttr} ${typeAndStep} value="${value}" />`;

        if (!wrap) {
            return html;
        }

        return this.WrapInForm(typeDescription, html);
    }

    RenderTextArea(typeDescription: CrocoTypeDescription, wrap: boolean): string {

        const value = ValueProviderHelper.GetStringValueFromValueProvider(typeDescription, this._model.ValueProvider);

        const styles = `style="margin-top: 0px; margin-bottom: 0px; height: 79px;"`;

        let propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);

        const html = `<label for="${typeDescription.PropertyDescription.PropertyName}">${propBlock.LabelText}</label>
            <textarea autocomplete="off" class="form-control m-input" name="${this.GetPropertyName(typeDescription.PropertyDescription.PropertyName)}" rows="3" ${styles}>${value}</textarea>`;

        if (!wrap) {
            return html;
        }

        return this.WrapInForm(typeDescription, html);
    }

    RenderGenericDropList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], isMultiple: boolean, wrap: boolean): string {

        const rawValue = ValueProviderHelper.GetRawValueFromValueProvider(typeDescription, this._model.ValueProvider);

        this._htmlDrawHelper.ProccessSelectValues(typeDescription, rawValue, selectList);

        const _class = `${this._selectClass} form-control m-input m-bootstrap-select m_selectpicker`;

        const dict = isMultiple ? new Map<string, string>().set("multiple", "") : null;

        const select = HtmlDrawHelper.RenderSelect(_class, this.GetPropertyName(typeDescription.PropertyDescription.PropertyName), selectList, dict);

        const propBlock = this.GetPropertyBlock(typeDescription.PropertyDescription.PropertyName);


        const html = `<label for="${typeDescription.PropertyDescription.PropertyName}">${propBlock.LabelText}</label>${select}`;

        if (!wrap) {
            return html;
        }

        return this.WrapInForm(typeDescription, html);
    }

    private WrapInForm(prop: CrocoTypeDescription, html: string): string {
        return `<div class="form-group m-form__group" ${FormDrawHelper.GetOuterFormAttributes(prop.PropertyDescription.PropertyName, this._model.Prefix)}>
                    ${html}
                </div>`;
    }

    RenderDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], wrap: boolean): string {
        return this.RenderGenericDropList(typeDescription, selectList, false, wrap);
    }

    RenderMultipleDropDownList(typeDescription: CrocoTypeDescription, selectList: SelectListItem[], wrap: boolean): string {
        return this.RenderGenericDropList(typeDescription, selectList, true, wrap);
    }
}