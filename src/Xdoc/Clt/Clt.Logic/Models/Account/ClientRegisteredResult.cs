using Xdoc.Model.Entities;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Logic.Models.Account
{
    public class ClientRegisteredResult
    {
        public Client Client { get; set; }

        public ApplicationUser User { get; set; }
    }
}
