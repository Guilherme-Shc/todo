export async function bodyToJson(req, res){
    //criação do buffer
    const buffers = [];

    //adicionando cada chunk de dados ao buffer
    for await(const chunks of req){
        buffers.push(chunks);
    }

    //concatenando uma unica sequencia de caracteres (string) 
    try{
        //dentro da request é criado um novo atributo chamado body que conterá todos os dados recebidos
        req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch { //catch é usado para pegar os possiveis erros que aparecerão
        req.body = null;
    }

    //pegando o content type e definindo que o cabeçalho de resposta padrão será o JSON
    res.setHeader('Content-type', 'application/json')
}

// a função bodyToJson lida com a recepção de dados de uma solicitação, converte esses dados 
// para JSON (objeto javascript), e configura a resposta para indicar que o conteúdo da respota também é um JSON