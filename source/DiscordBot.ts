import {Config} from "./Config";
import {AkairoClient, Command, CommandHandler, Inhibitor, InhibitorHandler, Listener, ListenerHandler} from "discord-akairo";
import {TextChannel} from "discord.js";

export class DiscordBot extends AkairoClient {

	private commandHandler: CommandHandler;
	private inhibitorHandler: InhibitorHandler;
	private listenerHandler: ListenerHandler;

	public constructor(config: Config) {
		super();
		this.commandHandler = new CommandHandler(this, {"prefix": config.get()["discord"]["prefix"]});
		this.inhibitorHandler = new InhibitorHandler(this, {});
		this.listenerHandler = new ListenerHandler(this, {});
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.token = config.get()["discord"]["token"];
	}

	public start(): void {
		if (this.token !== null && this.token !== undefined) {
			this.login(this.token).then();
		}
	}

	public stop(): void {
		this.destroy();
	}

	public registerCommand(command: Command): void {
		this.commandHandler.register(command);
	}

	public registerInhibitor(inhibitor: Inhibitor): void {
		this.inhibitorHandler.register(inhibitor);
	}

	public registerListener(listener: Listener): void {
		this.listenerHandler.register(listener);
	}

	public async send(message: string, channelID: string): Promise<any> {
		if (message.length === 0) return Promise.resolve();
		await (this.channels.cache.get(channelID) as TextChannel).send(message);
	}

}