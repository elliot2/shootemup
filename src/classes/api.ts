export interface GameStatusType {
  uuid?: string;
  wave: number;
  score: number;
  name?: string;
  lastUpdate: EpochTimeStamp;
}

export class API {
  private static readonly baseUrl = "http://localhost:9595";

  static async gameInit(): Promise<{ uuid: string }> {
    const response = await fetch(`${API.baseUrl}/gameInit`, {
      method: "POST",
    });
    return response.json();
  }

  static async getGames(): Promise<GameStatusType[]> {
    const response = await fetch(`${API.baseUrl}/games`, {
      method: "POST",
    });
    return response.json();
  }

  static async updateStatus(
    gameStatus: GameStatusType & { name?: string }
  ): Promise<{ updated: boolean }> {
    const response = await fetch(`${API.baseUrl}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameStatus),
    });
    return response.json();
  }
}
