using System;
using Croco.Core.Abstractions.Cache;

namespace Xdoc.Implementations
{
    public class ApplicationCacheValue : ICrocoCacheValue
    {
        public string Key { get; set; }
        public object Value { get; set; }
        public DateTime? AbsoluteExpiration { get; set; }
    }
}
