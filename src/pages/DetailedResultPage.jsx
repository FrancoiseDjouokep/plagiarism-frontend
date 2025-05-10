import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';
import '../styles/DetailedResult.css'
const DetailedResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/api/bigAnalysis/analyses/${id}/suspect-phrases`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error("Erreur :", error);
        setMessage("Erreur lors du chargement des résultats.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="layout"><p>Chargement...</p></div>;
  if (!data) return <div className="layout"><p>{message || "Aucune donnée disponible."}</p></div>;

  // Nouvelle fonction pour grouper les phrases similaires consécutives
  const groupConsecutivePhrases = (phrases, fullText) => {
    if (!phrases || phrases.length === 0) return [];
    
    // Trier les phrases par position dans le texte
    const sortedPhrases = [...phrases].sort((a, b) => 
      fullText.indexOf(a) - fullText.indexOf(b)
    );
    
    const groups = [];
    let currentGroup = [];
    
    for (let i = 0; i < sortedPhrases.length; i++) {
      const phrase = sortedPhrases[i];
      if (currentGroup.length === 0) {
        currentGroup.push(phrase);
      } else {
        const lastPhrase = currentGroup[currentGroup.length - 1];
        const lastIndex = fullText.indexOf(lastPhrase) + lastPhrase.length;
        const currentIndex = fullText.indexOf(phrase);
        
        // Vérifier si la phrase actuelle suit immédiatement la dernière phrase du groupe
        if (currentIndex <= lastIndex + 1) { // +1 pour tolérer un espace/retour à la ligne
          currentGroup.push(phrase);
        } else {
          groups.push([...currentGroup]);
          currentGroup = [phrase];
        }
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };

  const phraseGroups = groupConsecutivePhrases(data.sourcePhrases, data.sourceFullText);

  return (
    <div className="layout">
      <h2>Résultat détaillé de l'analyse</h2>
      <div className="containers" style={{ display: 'flex', gap: '20px' }}>
        {/* Colonne de gauche - Document source */}
        <div className="document-section" style={{ flex: 1 }}>
          <h3>Document soumis</h3>
          <div className="document-content">
            {highlightSuspectPhrases(data.sourceFullText, phraseGroups)}
          </div>
        </div>

        {/* Colonne de droite - Phrases correspondantes */}
        <div className="similar-phrases-section" style={{ flex: 1 }}>
          <h3>Phrases similaires trouvées</h3>
          {phraseGroups.length === 0 && <p>Aucune correspondance trouvée.</p>}
          <div className="matched-phrases-list">
            {phraseGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="matched-group" style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  Bloc #{groupIndex + 1}
                </div>
                {data.similarDocuments.map((doc, docIndex) => (
                  <div key={doc.id} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold' }}>{doc.title} (ID: {doc.id})</div>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                      {doc.matchedPhrases
                        .filter(phrase => group.includes(phrase.sourcePhrase))
                        .map((phrase, i) => (
                          <li key={i} className="matched-phrase">
                            ❝{phrase.matchedText}❞
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">⬅ Retour</button>
    </div>
  );
};
export default DetailedResult;
function highlightSuspectPhrases(text, phraseGroups) {
  if (!phraseGroups || phraseGroups.length === 0) return <p>{text}</p>;

  // Créer une liste de toutes les phrases à surligner
  const allPhrases = phraseGroups.flat();
  
  // D'abord marquer toutes les phrases individuelles
  let highlighted = text;
  allPhrases.forEach((phrase) => {
    const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safePhrase})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  // Ensuite, regrouper les marques pour les phrases consécutives
  phraseGroups.forEach((group, index) => {
    if (group.length > 1) {
      const firstPhrase = group[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lastPhrase = group[group.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Trouver le texte entre la première et dernière phrase du groupe
      const start = highlighted.indexOf(`<mark>${firstPhrase}`);
      const end = highlighted.indexOf(`</mark>${lastPhrase}`) + `</mark>${lastPhrase}`.length;
      
      if (start !== -1 && end !== -1) {
        const groupText = highlighted.substring(start, end);
        // Remplacer les marques internes
        const cleanedGroup = groupText.replace(/<\/mark><mark>/g, ' ');
        // Ajouter l'indice
        const numberedGroup = cleanedGroup.replace(
          /^<mark>/,
          `<mark class="group-highlight" data-group="${index + 1}">`
        );
        highlighted = highlighted.substring(0, start) + numberedGroup + highlighted.substring(end);
      }
    } else {
      // Pour les groupes d'une seule phrase, juste ajouter l'indice
      const phrase = group[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      highlighted = highlighted.replace(
        new RegExp(`<mark>(${phrase})<\/mark>`, 'gi'),
        `<mark class="group-highlight" data-group="${index + 1}">$1</mark>`
      );
    }
  });

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
}