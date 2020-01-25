using System;
using Croco.Core.Abstractions.Cache;
using Croco.Core.Abstractions.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Xdoc.Implementations
{
    public class ApplicationCacheManager : ICrocoCacheManager
    {
        private readonly IMemoryCache _cache;

        public ApplicationCacheManager(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void AddValue(ICrocoCacheValue cacheValue)
        {
            var offSet = cacheValue.AbsoluteExpiration.HasValue ? new DateTimeOffset(cacheValue.AbsoluteExpiration.Value) : DateTimeOffset.MaxValue;

            _cache.Set(cacheValue.Key, cacheValue.Value, offSet);
        }

        public T GetOrAddValue<T>(string key, Func<T> valueFactory)
        {
            var res = _cache.TryGetValue(key, out T result);

            if (res)
            {
                return result;
            }

            result = valueFactory();

            AddValue(new ApplicationCacheValue
            {
                Key = key,
                Value = result,
                AbsoluteExpiration = DateTime.MaxValue
            });

            return result;
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
        }

        public CrocoSafeValue<T> GetValue<T>(string key)
        {
            var res = _cache.TryGetValue(key, out T result);

            return new CrocoSafeValue<T>(res, result);
        }
    }
}