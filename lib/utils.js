export function Equals(tableau1, tableau2) {
    // Vérifier si les tableaux ont la même longueur
    if (tableau1.length !== tableau2.length) {
      return false;
    }
  
    // Comparer chaque élément des tableaux
    for (let i = 0; i < tableau1.length; i++) {
      if (tableau1[i] !== tableau2[i]) {
        return false;
      }
    }
  
    // Les tableaux sont identiques
    return true;
  }
  