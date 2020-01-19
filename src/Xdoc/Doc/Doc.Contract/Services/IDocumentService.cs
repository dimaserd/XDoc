using Croco.Core.Abstractions;
using Doc.Contract.Models;
using System.Threading.Tasks;

namespace Doc.Contract.Services
{
    public interface IDocumentService
    {
        Task<ICrocoBaseResponse> CreateDemoDocument(DemoDocumentModel purchase);
    }
}