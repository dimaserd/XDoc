class ValueProviderHelper {
    static GetStringValueFromValueProvider(prop: CrocoTypeDescription, valueProvider: GenericUserInterfaceValueProvider): string {

        let value = ValueProviderHelper.GetRawValueFromValueProvider(prop, valueProvider);

        return value == null ? "" : value;
    }

    static GetRawValueFromValueProvider(prop: CrocoTypeDescription, valueProvider: GenericUserInterfaceValueProvider): string {

        if (valueProvider == null) {

            return null;
        }

        if (!prop.IsEnumerable) {

            var value = valueProvider.Singles.find(x => x.PropertyName == prop.PropertyDescription.PropertyName);

            return (value == null) ? null : value.Value;
        }

        return "";
    }
}