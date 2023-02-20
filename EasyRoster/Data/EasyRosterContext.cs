using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EasyRoster.Models;

namespace EasyRoster.Data
{
    public class EasyRosterContext : DbContext
    {
        public EasyRosterContext (DbContextOptions<EasyRosterContext> options)
            : base(options)
        {
        }

        public DbSet<EasyRoster.Models.Customer> Customer { get; set; } = default!;
    }
}
