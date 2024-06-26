import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { NpmChatStore } from '@store';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessageComponent],
  templateUrl: './messages.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {
  readonly #renderer = inject(Renderer2);
  readonly #npmChatStore = inject(NpmChatStore);
  messages = this.#npmChatStore.selectMessages;
  messageCount = this.#npmChatStore.selectMessageCount;
  scrollable = input.required<HTMLElement>();

  constructor() {
    effect(() => {
      const messageCount = this.messageCount();
      const scrollable = untracked(this.scrollable);
      if (messageCount > 0 && scrollable) {
        this.#scrollToBottomNextTick(scrollable);
      }
    });
  }

  #scrollToBottomNextTick(scrollable: HTMLElement) {
    setTimeout(() => {
      const scrollHeight = scrollable.scrollHeight;
      this.#renderer.setProperty(scrollable, 'scrollTop', scrollHeight);
    }, 0);
  }
}
