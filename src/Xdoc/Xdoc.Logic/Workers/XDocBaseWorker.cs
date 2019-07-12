using Croco.Core.Abstractions.ContextWrappers;
using Croco.Core.Abstractions.Settings;
using Croco.Core.Application;
using Croco.Core.Logic.Workers;
using Xdoc.Logic.Implementations;
using Xdoc.Model.Contexts;

namespace Xdoc.Logic.Workers
{
    public class XDocBaseWorker : BaseCrocoWorker
    {
        public XDocBaseWorker(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
            ApplicationContextWrapper = contextWrapper;
        }

        public XdocDbContext Context => ApplicationContextWrapper.DbContext;

        protected XDocWebApplication Application => CrocoApp.Application as XDocWebApplication;

        protected T GetSetting<T>() where T : class, ICommonSetting<T>, new()
        {
            return CrocoApp.Application.SettingsFactory.GetSetting<T>();
        }

        public IUserContextWrapper<XdocDbContext> ApplicationContextWrapper { get; set; }

    }
}
