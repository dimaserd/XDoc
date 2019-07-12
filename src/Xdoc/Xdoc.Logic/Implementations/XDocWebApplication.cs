using Croco.WebApplication.Application;

namespace Xdoc.Logic.Implementations
{
    public class XDocWebApplication : CrocoWebApplication
    {
        public XDocWebApplication(CrocoWebApplicationOptions options) : base(options)
        {
        }

        public bool IsDevelopment { get; set; }
    }
}
