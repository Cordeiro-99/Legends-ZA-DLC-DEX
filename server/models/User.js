const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  pokedex: {
    type: Object,
    default: () => ({
      'legends-za': {},
      'national-dex': {},
      'shiny-dex': {}
    })
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para garantir a estrutura correta (APENAS para documentos Mongoose)
UserSchema.post('findOne', function(doc) {
  if (doc && typeof doc === 'object' && doc._id) {
    // Apenas para documentos Mongoose (não para .lean())
    if (doc.pokedex) {
      // Se pokedex é um objeto vazio ou antigo, converte para nova estrutura
      const isOldStructure = !doc.pokedex['legends-za'] && 
                           !doc.pokedex['national-dex'] && 
                           !doc.pokedex['shiny-dex'];
      
      if (isOldStructure) {
        // Verifica se tem dados na raiz (estrutura antiga)
        const hasOldData = Object.keys(doc.pokedex).some(key => 
          key !== 'legends-za' && key !== 'national-dex' && key !== 'shiny-dex'
        );
        
        if (hasOldData) {
          // Move dados antigos para legends-za
          doc.pokedex = {
            'legends-za': { ...doc.pokedex },
            'national-dex': {},
            'shiny-dex': {}
          };
          
          // Apenas marca como modificado se for um documento Mongoose
          if (doc instanceof mongoose.Document) {
            doc.markModified('pokedex');
          }
        }
      }
    }
  }
});

// Middleware para transformar dados ao carregar (também para .lean())
UserSchema.set('toObject', { transform: transformPokedex });
UserSchema.set('toJSON', { transform: transformPokedex });

function transformPokedex(doc, ret, options) {
  // Esta função é chamada tanto para toObject() quanto para toJSON()
  if (ret.pokedex) {
    const isOldStructure = !ret.pokedex['legends-za'] && 
                         !ret.pokedex['national-dex'] && 
                         !ret.pokedex['shiny-dex'];
    
    if (isOldStructure) {
      // Verifica se tem dados na raiz (estrutura antiga)
      const hasOldData = Object.keys(ret.pokedex).some(key => 
        key !== 'legends-za' && key !== 'national-dex' && key !== 'shiny-dex'
      );
      
      if (hasOldData) {
        // Transforma estrutura antiga em nova
        ret.pokedex = {
          'legends-za': { ...ret.pokedex },
          'national-dex': {},
          'shiny-dex': {}
        };
      } else {
        // Garante que todas as chaves existem
        ret.pokedex = {
          'legends-za': ret.pokedex['legends-za'] || {},
          'national-dex': ret.pokedex['national-dex'] || {},
          'shiny-dex': ret.pokedex['shiny-dex'] || {}
        };
      }
    }
  }
  return ret;
}

module.exports = mongoose.model('User', UserSchema);