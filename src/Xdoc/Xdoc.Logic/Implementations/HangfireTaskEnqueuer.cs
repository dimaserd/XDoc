using Croco.Core.EventSource.Abstractions;
using Hangfire;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Xdoc.Logic.Implementations
{
    public class HangfireTaskEnqueuer : ICrocoTaskEnqueuer
    {
        /// <summary>
        /// Поставить задачу в очередь
        /// </summary>
        /// <param name="methodCall"></param>
        public void Enqueue(Expression<Func<Task>> methodCall)
        {
            BackgroundJob.Enqueue(methodCall);
        }
    }
}
