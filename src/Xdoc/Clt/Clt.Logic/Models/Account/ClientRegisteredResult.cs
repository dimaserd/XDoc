using FocLab.Model.Entities.Users.Default;
using Xdoc.Model.Entities;

namespace Clt.Logic.Models.Account
{
    public class ClientRegisteredResult
    {
        public Client Client { get; set; }

        public ApplicationUser User { get; set; }
    }
}
