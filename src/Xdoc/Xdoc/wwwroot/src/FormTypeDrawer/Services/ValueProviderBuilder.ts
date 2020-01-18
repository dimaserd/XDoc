class ValueProviderBuilder {

    /**
     * Создать провайдера значений из объекта JavaScript
     * @param obj объект из которого нужно создать провайдер значений
     */
    static CreateFromObject(obj: object): GenericUserInterfaceValueProvider {

        obj = CrocoAppCore.Application.FormDataUtils.ProccessAllDateTimePropertiesAsString(obj);

        let res: GenericUserInterfaceValueProvider = {
            Arrays: [],
            Singles: []
        };

        for (var index in obj) {

            let valueOfProp = obj[index];

            if (Array.isArray(valueOfProp)) {

                //TODO Добавить поддержку массивов
                continue;
            }

            if (valueOfProp !== undefined) {
                res.Singles.push({
                    PropertyName: index,
                    Value: valueOfProp
                })
            }
        }

        return res;
    }
}