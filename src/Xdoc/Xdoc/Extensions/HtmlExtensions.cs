using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Croco.Core.Application;
using Croco.Core.Search;
using Croco.Core.Utils;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Xdoc.Logic.Implementations;

namespace Xdoc.Extensions
{
    public static class HtmlExtensions
    {
        public static IHtmlContent GetJson(this IHtmlHelper htmlHelper, object obj)
            => new HtmlString(Tool.JsonConverter.Serialize(obj));

        public static Task<IHtmlContent> RenderPaginationAsync<T>(this IHtmlHelper htmlHelper, GetListResult<T> model, string linkFormat) where T : class
        {
            return htmlHelper.PartialAsync("~/Views/Components/Pagination.cshtml", PagerModel.ToPagerModel(model, linkFormat));
        }

        public static Task<IHtmlContent> RenderApplicationFilesAsync(this IHtmlHelper htmlHelper, string applicationName)
        {
            if (CrocoApp.Application.As<XDocWebApplication>().IsDevelopment)
            {
                var appDirPath = CrocoApp.Application.MapPath($"~/wwwroot/Applications/{applicationName}");

                var jsDirPath = $"{appDirPath}/js";

                var jsFiles = Directory.Exists(jsDirPath) ? Directory.EnumerateFiles(jsDirPath, "*.js").Select(x => $"/Applications/{applicationName}/js/{Path.GetFileName(x)}").ToList() : new List<string>();

                var cssDirPath = $"{appDirPath}/css";

                var cssFiles = Directory.Exists(cssDirPath) ? Directory.EnumerateFiles(cssDirPath, "*.css").Select(x => $"/Applications/{applicationName}/css/{Path.GetFileName(x)}").ToList() : new List<string>();

                htmlHelper.ViewData[nameof(jsFiles)] = jsFiles;
                htmlHelper.ViewData[nameof(cssFiles)] = cssFiles;

                return htmlHelper.PartialAsync("~/Views/Helpers/RenderApplicationFilesDev.cshtml", applicationName);
            }

            return htmlHelper.PartialAsync("~/Views/Helpers/RenderApplicationFiles.cshtml", applicationName);
        }
    }
}
