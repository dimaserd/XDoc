using Croco.Core.Abstractions.Cache;
using System;
using System.Threading.Tasks;

namespace Zoo
{
    public class Optimizations
    {
        public static T GetValue<T>(string key, Func<Task<T>> valueFactory, ICrocoCacheManager cacheManager)
        {
            return cacheManager.GetOrAddValue(key, () => valueFactory().GetAwaiter().GetResult());
        }
    }
}