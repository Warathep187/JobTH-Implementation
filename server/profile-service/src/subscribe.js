import { consume } from "./app/models/messageQueueModel";
import { Queues } from "./constants/queuesAndExchanges";
import subscriptionControllers from "./app/controllers/subscription.js";

const subscribe = async () => {
  consume(Queues.AUTH_PROFILE_ROLLED_BACK, subscriptionControllers.rollback);
  consume(Queues.AUTH_PROFILE_ROLLED_BACK_DEAD, subscriptionControllers.rollback);
};

export default subscribe;