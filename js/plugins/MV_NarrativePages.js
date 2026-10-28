/*:
 * @plugindesc v0.1.0 Paginação pura por palavras, sem conteúdo ou estado de jogo.
 * @author Codex
 * @help MVNarrativePages.page(text,word,width,lineLimit,measure) retorna lines/next/total.
 * Índice de palavra estável entre resoluções. Não executa ações ou salva dados.
 */
var MVNarrativePages={page:function(text,word,width,limit,measure){
    var words=String(text).trim().split(/\s+/),lines=[],line='',i=Math.min(word,words.length);
    for(;i<words.length;i++){
        var next=line?line+' '+words[i]:words[i];
        if(line&&measure(next)>width){lines.push(line);line='';if(lines.length>=limit)break;}
        line=line?line+' '+words[i]:words[i];
    }
    if(line)lines.push(line);
    return {lines:lines,next:i,total:words.length};
}};
if(typeof module!=='undefined'&&module.exports)module.exports=MVNarrativePages;
