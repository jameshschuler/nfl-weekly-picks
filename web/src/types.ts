export interface ExternalEvent {
  id: string;
  competitions: {
    competitors: {
      //
      team: {
        id: string; // external team ID
      };
      winner: boolean;
      homeAway: "home" | "away";
      record: {
        displayValue: string;
      };
      score: {
        value: number;
      };
    }[];
    status: {
      type: {
        name: string; // STATUS_IN_PROGRESS, STATUS_FINAL
        completed: boolean;
      };
    };
  }[];
}
