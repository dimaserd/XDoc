class PropertyFormTypeSearcher {
    static FindPropByNameInOneDimension(type: CrocoTypeDescription, propName: string): CrocoTypeDescription {
        return type.Properties.find(x => x.PropertyDescription.PropertyName === propName);
    }
    static FindPropByName(type: CrocoTypeDescription, propName: string): CrocoTypeDescription {
        if (propName.includes(".")) {
            let indexOfFirstDot = propName.indexOf(".");
            let fBit = propName.slice(0, indexOfFirstDot);
            let anotherBit = propName.slice(indexOfFirstDot + 1, propName.length);
            let innerProp = PropertyFormTypeSearcher.FindPropByNameInOneDimension(type, fBit);
            return PropertyFormTypeSearcher.FindPropByName(innerProp, anotherBit);
        }
        let prop = PropertyFormTypeSearcher.FindPropByNameInOneDimension(type, propName);
        if (prop == null) {
            throw new Error(`Свойство ${propName} не найдено`);
        }
        return prop;
    }
}
