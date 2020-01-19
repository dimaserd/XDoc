using Croco.WebApplication.Application;
using Microsoft.AspNetCore.StaticFiles;

namespace Xdoc.Logic.Implementations
{
    public class XDocWebApplication : CrocoWebApplication
    {
        public XDocWebApplication(CrocoWebApplicationOptions options) : base(options)
        {
        }

        public static string GetMimeMapping(string fileName)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var contentType);

            return contentType ?? "application/octet-stream";
        }

        public static bool IsImage(string fileName)
        {
            return GetMimeMapping(fileName).StartsWith("image/");
        }

        public bool IsDevelopment { get; set; }
    }
}