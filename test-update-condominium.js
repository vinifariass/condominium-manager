// Teste manual para verificar a API de atualização de condomínio
async function testUpdateCondominium() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Primeiro, vamos buscar um condomínio existente
    console.log('1. Buscando condomínios...');
    const getResponse = await fetch(`${baseUrl}/api/condominiums`);
    const getResult = await getResponse.json();
    
    if (!getResult.data || getResult.data.length === 0) {
      console.log('❌ Nenhum condomínio encontrado para testar');
      return;
    }
    
    const firstCondominium = getResult.data[0];
    console.log('✅ Condomínio encontrado:', firstCondominium.name, firstCondominium.id);
    
    // Agora vamos tentar atualizar
    console.log('2. Testando atualização...');
    const updateData = {
      id: firstCondominium.id,
      name: firstCondominium.name + ' - ATUALIZADO',
      address: firstCondominium.address,
      city: firstCondominium.city,
      state: firstCondominium.state,
      zipCode: firstCondominium.zipCode,
      status: firstCondominium.status
    };
    
    console.log('Dados para atualização:', updateData);
    
    const updateResponse = await fetch(`${baseUrl}/api/condominiums`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Status da resposta:', updateResponse.status);
    const updateResult = await updateResponse.json();
    console.log('Resultado da atualização:', updateResult);
    
    if (updateResponse.ok) {
      console.log('✅ Atualização bem-sucedida!');
    } else {
      console.log('❌ Erro na atualização:', updateResult.error);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Para executar no navegador, cole este código no console da página
console.log('Para testar, execute: testUpdateCondominium()');
