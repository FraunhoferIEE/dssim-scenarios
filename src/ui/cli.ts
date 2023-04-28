/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/*
 * Copyright 2023 Fraunhofer IEE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *       Michel Otto - initial implementation
 *
 */
import {Scenario, ScenarioConfiguration} from 'dssim-core';
import KubernetesController from 'dssim-kubernetes-controller';
import inquirer from 'inquirer';
import {configurations, defaultDashboards} from '../configurations/index.js';
import {TearDown} from '../scenarios/TearDown.js';

export class DssimCli {
  constructor(
    private scenarios: {new (): Scenario}[],
    private runScenarioFn: (
      szenario: Scenario,
      configuration: ScenarioConfiguration,
      tearDown: boolean
    ) => void
  ) {}

  start(): void {
    inquirer
      .prompt([
        {
          type: 'list',
          loop: false,
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            {
              name: 'Tear down current scenario / clear environment',
              value: 'teardown',
            },
            {
              name: 'Start up a new scenario',
              value: 'start',
            },
          ],
        },
      ])
      .then(answers => {
        if (answers.action === 'teardown') {
          tearDown();
        } else {
          scenarioSelection();
        }
      })
      .catch(error => {
        console.error(error);
      });

    const tearDown = () => {
      this.runScenarioFn(new TearDown(), configurations[0], false);
    };

    const scenarioSelection = () => {
      inquirer
        .prompt([
          {
            type: 'list',
            loop: false,
            name: 'szenarioSelection',
            message: 'Select scenario to execute:',
            choices: this.scenarios.map((scenario, index) => {
              return {
                name: scenario.name,
                value: index,
              };
            }),
          },
          {
            type: 'list',
            loop: false,
            name: 'configuration',
            message: 'Select scenario to execute:',
            choices: configurations.map((configuration, index) => {
              return {
                name: configuration.name,
                value: index,
              };
            }),
          },
          {
            type: 'confirm',
            name: 'netcontrol',
            message: 'Does your scenario require NetworkControl?',
            default: false,
          },
          {
            type: 'confirm',
            name: 'monitoring',
            message: 'Deploy Monitoring?',
            default: true,
          },
          {
            type: 'confirm',
            name: 'teardownAfter',
            message: 'Teardown after scenario execution?',
            default: false,
          },
        ])
        .then(answers => {
          const configuration = configurations[answers.configuration];
          const selectedScenario = new this.scenarios[
            answers.szenarioSelection
          ]();
          configuration.environmentControllerFactory =
            async (): Promise<KubernetesController> =>
              await KubernetesController.createInstance(
                answers.netcontrol,
                answers.monitoring
                  ? {
                      dashboardDefinitions: defaultDashboards,
                      prometheusUrl:
                        'http://rancher-monitoring-prometheus.cattle-monitoring-system:9090/',
                      defaultLogLevel: 'debug',
                    }
                  : undefined
              );
          this.runScenarioFn(
            selectedScenario,
            configuration,
            answers.teardownAfter
          );
        })
        .catch(error => {
          console.error(error);
        });
    };
  }
}
