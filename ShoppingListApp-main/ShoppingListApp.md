# **Guide Complet d'Implémentation : ShoppingListApp.jsx**  
*(Application Web de Gestion de Listes de Courses)*  

---

## **📌 Table des Matières**  
1. [**Introduction**](#-introduction)  
2. [**Prérequis Techniques**](#-prérequis-techniques)  
3. [**Structure du Projet**](#-structure-du-projet)  
4. [**Backend (Node.js/Express)**](#-backend-nodejsexpress)  
   - 4.1 Configuration de base  
   - 4.2 Modèles MongoDB  
   - 4.3 Routes API  
   - 4.4 Authentification  
5. [**Frontend (React)**](#-frontend-react)  
   - 5.1 Initialisation  
   - 5.2 Composants principaux  
   - 5.3 Connexion à l'API  
6. [**Déploiement**](#-déploiement)  
   - 6.1 Sur Render (Backend)  
   - 6.2 Sur Netlify (Frontend)  
7. [**Annexes**](#-annexes)  
   - Commandes Git  
   - Dépannage  

---

## **🚀 Introduction**  
Ce guide pas-à-pas vous permettra de créer une **application web complète de gestion de listes de courses**, avec :  
✅ **Backend** en Node.js/Express + MongoDB  
✅ **Frontend** en React (TypeScript)  
✅ **Authentification** utilisateur  
✅ **Déploiement** en ligne  

**Public cible** : Débutants et développeurs intermédiaires.  

---

## **🛠 Prérequis Techniques**  
- **Node.js** (v18+) : [Télécharger ici](https://nodejs.org)  
- **Git** : [Télécharger ici](https://git-scm.com)  
- **Compte MongoDB Atlas** (gratuit) : [S’inscrire ici](https://mongodb.com/atlas)  
- **Éditeur de code** (VS Code recommandé)  

---

## **📂 Structure du Projet**  
```bash
shopping-list-app/
├── client/          # Application React (Frontend)
│   ├── public/      # Fichiers statiques
│   ├── src/         # Code source
│   ├── package.json # Dépendances
├── server/          # API Node.js (Backend)
│   ├── models/      # Schémas MongoDB
│   ├── routes/      # Routes API
│   ├── server.js    # Point d'entrée
│   ├── .env         # Variables secrètes
├── .gitignore       # Fichiers à ignorer
└── README.md        # Documentation
```

---

## **🔙 Backend (Node.js/Express)**  

### **4.1 Configuration de base**  
1. **Initialiser le projet** :  
   ```bash
   mkdir server && cd server
   npm init -y
   npm install express mongoose cors dotenv jsonwebtoken bcryptjs
   ```

2. **Fichier `server.js`** *(Point d'entrée)* :  
   ```javascript
   require('dotenv').config();
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   const userRoutes = require('./routes/users');
   const listRoutes = require('./routes/lists');

   const app = express();
   app.use(cors());
   app.use(express.json());

   // Connexion MongoDB
   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("✅ Connecté à MongoDB"))
     .catch(err => console.error("❌ Erreur DB:", err));

   // Routes
   app.use('/api/users', userRoutes);
   app.use('/api/lists', listRoutes);

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
   ```

3. **Fichier `.env`** :  
   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/shoppinglistapp
   JWT_SECRET=secret123
   PORT=5000
   ```

---

### **4.2 Modèles MongoDB**  
1. **`server/models/User.js`** *(Utilisateurs)* :  
   ```javascript
   const mongoose = require('mongoose');
   const bcrypt = require('bcryptjs');

   const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true }
   });

   // Hash du mot de passe avant sauvegarde
   userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 10);
     next();
   });

   module.exports = mongoose.model('User', userSchema);
   ```

2. **`server/models/List.js`** *(Listes de courses)* :  
   ```javascript
   const mongoose = require('mongoose');

   const listSchema = new mongoose.Schema({
     name: { type: String, required: true },
     items: [{
       name: String,
       quantity: Number,
       price: Number,
       purchased: Boolean
     }],
     owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   }, { timestamps: true });

   module.exports = mongoose.model('List', listSchema);
   ```

---

### **4.3 Routes API**  
1. **`server/routes/users.js`** *(Authentification)* :  
   ```javascript
   const express = require('express');
   const router = express.Router();
   const User = require('../models/User');
   const jwt = require('jsonwebtoken');

   // Inscription
   router.post('/register', async (req, res) => {
     try {
       const user = new User(req.body);
       await user.save();
       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
       res.status(201).send({ token });
     } catch (err) {
       res.status(400).send(err);
     }
   });

   // Connexion
   router.post('/login', async (req, res) => {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return res.status(400).send("Email incorrect");

     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) return res.status(400).send("Mot de passe incorrect");

     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
     res.send({ token });
   });

   module.exports = router;
   ```

---

## **🖥 Frontend (React)**  

### **5.1 Initialisation**  
1. **Créer l’application React** :  
   ```bash
   npx create-react-app client --template typescript
   cd client
   npm install axios react-router-dom @types/react-router-dom
   ```

2. **`client/src/App.tsx`** *(Point d'entrée)* :  
   ```tsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import Login from './pages/Login';
   import Lists from './pages/Lists';

   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Lists />} />
           <Route path="/login" element={<Login />} />
         </Routes>
       </BrowserRouter>
     );
   }
   export default App;
   ```

---

## **🌐 Déploiement**  

### **6.1 Backend sur Render**  
1. **Créer un compte** sur [render.com](https://render.com)  
2. **Connecter votre dépôt GitHub**  
3. **Configurer** :  
   - Environnement : Node.js  
   - Commande de build : `npm install`  
   - Commande de démarrage : `node server.js`  

### **6.2 Frontend sur Netlify**  
1. **Déployer depuis `client/build`**  
2. **Configurer les variables d’environnement** :  
   ```env
   REACT_APP_API_URL=https://votre-api.render.com
   ```

---

## **🔧 Annexes**  

### **Commandes Git Essentielles**  
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-user/shopping-list-app.git
git push -u origin main
```

### **Dépannage**  
- **Erreur MongoDB** : Vérifiez `MONGO_URI` dans `.env`  
- **Erreur CORS** : Ajoutez `app.use(cors())` dans `server.js`  

---

**📌 Conclusion** : Vous avez maintenant **tous les outils** pour développer, tester et déployer votre application.  
**Prochaines étapes** : Ajouter des fonctionnalités (partage de listes, scanner de codes-barres).  

➡ **Besoin d’aide ?** Posez vos questions ! 🚀
