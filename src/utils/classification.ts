import { Client } from '../client/entities/client.entity';

export const clientClassification = (lastVisit: Date) => {
  const today = new Date();
  const diffEmMilissegundos = today.getTime() - new Date(lastVisit).getTime();
  const diffEmDias = diffEmMilissegundos / (1000 * 3600 * 24); // Converter de milissegundos para dias

  if (diffEmDias <= 30) return 'Excelente'; // Até 1 mês
  if (diffEmDias <= 60) return 'Otimo'; // Até 2 meses
  if (diffEmDias <= 90) return 'Regular'; // Até 3 meses
  return 'Ruim'; // Mais de 3 meses
};

export const verifyLastVisit = (client: Client) => {
  const lastVisit = client.comandas.reduce((latest: Date | null, comanda) => {
    const dateCommand = new Date(comanda.dataLancamento);
    return latest === null || dateCommand > latest ? dateCommand : latest;
  }, null);

  return lastVisit;
};
