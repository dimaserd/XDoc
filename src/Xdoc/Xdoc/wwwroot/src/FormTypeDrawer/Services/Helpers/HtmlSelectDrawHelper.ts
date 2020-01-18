class HtmlSelectDrawHelper {
    NullValue: string;
    constructor(nullValue: string) {
        this.NullValue = nullValue;
    }
    ProccessSelectValues(typeDescription: CrocoTypeDescription, rawValue: string, selectList: SelectListItem[]): void {
        selectList.forEach(x => {
            if (x.Value == null) {
                x.Value = this.NullValue;
            }
        });
        if (rawValue != null) {
            selectList.forEach(x => x.Selected = false);
            //Заплатка для выпадающего списка 
            //TODO Вылечить это
            var item = typeDescription.TypeName == CSharpType.Boolean.toString() ?
                selectList.find(x => x.Value.toLowerCase() == rawValue.toLowerCase()) :
                selectList.find(x => x.Value == rawValue);
            if (item != null) {
                item.Selected = true;
            }
        }
    }
}