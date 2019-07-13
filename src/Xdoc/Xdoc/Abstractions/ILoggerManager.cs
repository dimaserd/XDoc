using System;
using System.Threading.Tasks;

namespace Xdoc.Abstractions
{
    public interface ILoggerManager
    {
        Task LogExceptionAsync(Exception ex);
    }
}
