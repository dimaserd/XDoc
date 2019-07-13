using Croco.WebApplication.Abstractions;
using Microsoft.AspNetCore.Hosting;

namespace Xdoc.Implementations
{
    public class ApplicationServerVirtualPathMapper : IServerVirtualPathMapper
    {
        private readonly IHostingEnvironment _env;

        public ApplicationServerVirtualPathMapper(IHostingEnvironment env)
        {
            _env = env;
        }

        public string MapPath(string path)
        {
            if (path.StartsWith("~"))
            {
                return path.Replace("~", _env.ContentRootPath);
            }

            return $"{_env.ContentRootPath}{path}";
        }
    }
}
