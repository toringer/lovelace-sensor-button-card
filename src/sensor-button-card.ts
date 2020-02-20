import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers';

import './editor';

import { SensorButtonCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  SENSOR-BUTTON-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// TODO Name your custom element
@customElement('sensor-button-card')
export class SensorButtonCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('sensor-button-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass?: HomeAssistant;
  @property() private _config?: SensorButtonCardConfig;

  public setConfig(config: SensorButtonCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    this._config = {
      name: 'Sensor Button',
      precision: 2,
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this._config.hold_action),
          hasDoubleTap: hasAction(this._config.double_tap_action),
          repeat: this._config.hold_action ? this._config.hold_action.repeat : undefined,
        })}
        tabindex="0"
        aria-label=${`SensorButton: ${this._config.entity}`}
        class="card"
      >
        <div class="name">
          ${this._config.name}
        </div>
        <div class="sensor" style="color:${this.getSensorColor(stateObj.state)}">
          <div class="sensor-value">${this.getState(stateObj.state)}</div>
          <div class="sensor-unit">${stateObj.attributes.unit_of_measurement}</div>
        </div>
      </ha-card>
    `;
  }

  private getSensorColor(state: string): string {
    if (this._config?.below !== undefined && parseFloat(state) < this._config?.below.limit) {
      return this._config?.below.color;
    }

    if (this._config?.above !== undefined && parseFloat(state) > this._config?.above.limit) {
      return this._config?.above.color;
    }

    return 'inheret';
  }

  private getState(state: string): string {
    const value = parseFloat(state);
    return value.toFixed(this._config?.precision);
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this._config && ev.detail.action) {
      //handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }

  static get styles(): CSSResult {
    return css`
      .card {
        padding: 16px;
      }
      .name {
        margin-bottom: 4px;
        color: gray;
      }
      .sensor {
      }
      .sensor-value {
        font-size: 2rem;
        display: inline;
      }
      .sensor-unit {
        display: inline;
      }
    `;
  }
}
