using Croco.Core.Abstractions;
using Croco.Core.Logic.Workers;
using Xdoc.Logic.Implementations;

namespace Xdoc.Logic.Workers
{
    public class XDocBaseWorker : BaseCrocoWorker<XDocWebApplication>
    {
        public XDocBaseWorker(ICrocoAmbientContext context) : base(context)
        {
        }
    }
}