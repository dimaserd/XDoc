using Croco.Core.Logic.Workers.Documentation;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Xdoc.Extensions
{
    public static class MvcExtensions
    {
        public static IEnumerable<SelectListItem> GetEnumDropdownList(Type type)
        {
            if (!type.IsEnum)
            {
                throw new ApplicationException($"Тип {type.FullName} не является перечислением");
            }

            var descr = ClassModelDescriptor.GetDocumentationForClass(type);

            return descr.EnumValues.Select(x => new SelectListItem
            {
                Text = x.DisplayName,
                Value = x.StringRepresentation
            });
        }

    }
}
