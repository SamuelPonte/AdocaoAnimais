using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdocaoAnimais_v1.Data;
using AdocaoAnimais_v1.Models;
using Microsoft.AspNetCore.Authorization;

namespace AdocaoAnimais_v1.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkinsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkinsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SkinsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Skins>>> GetSkinsTabela()
        {
            return await _context.SkinsTabela.ToListAsync();
        }

        // GET: api/SkinsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Skins>> GetSkins(int id)
        {
            var skins = await _context.SkinsTabela.FindAsync(id);

            if (skins == null)
            {
                return NotFound();
            }

            return skins;
        }

        // PUT: api/SkinsApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        // linha abaixo bloqeuia a rota casa nao esteja autenticado
        [Authorize]
        public async Task<IActionResult> PutSkins(int id, Skins skins)
        {
            if (id != skins.Id)
            {
                return BadRequest();
            }

            _context.Entry(skins).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SkinsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SkinsApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Skins>> PostSkins(Skins skins)
        {
            skins.Dono = User.Identity.Name;
            _context.SkinsTabela.Add(skins);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSkins", new { id = skins.Id }, skins);
        }

        // DELETE: api/SkinsApi/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSkins(int id)
        {
            var skins = await _context.SkinsTabela.FindAsync(id);
            if (skins == null)
            {
                return NotFound();
            }
            
            if (skins.Dono != User.Identity.Name)
            {
                return BadRequest();
            }

            _context.SkinsTabela.Remove(skins);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SkinsExists(int id)
        {
            return _context.SkinsTabela.Any(e => e.Id == id);
        }
    }
}
