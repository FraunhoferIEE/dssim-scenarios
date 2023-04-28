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
import {ScenarioController} from 'dssim-scenario-controller';
import {Scenario, ScenarioConfiguration} from 'dssim-core';

const componentName = 'dssim-scenarios';

export const runScenarioFunction = (
  szenario: Scenario,
  configuration: ScenarioConfiguration,
  tearDown: boolean
) => {
  ScenarioController.initiate(configuration)
    .then(scenarioController =>
      scenarioController
        .runScenario(szenario)
        .then(() => {
          if (tearDown) {
            scenarioController.log(
              'info',
              'starting teardown.',
              componentName,
              {}
            );
            scenarioController
              .tearDown()
              .then(() =>
                scenarioController.log(
                  'info',
                  'finished scenario execution with teardown',
                  componentName,
                  {}
                )
              );
          } else {
            scenarioController.log(
              'info',
              'finished scenario execution without teardown',
              componentName,
              {}
            );
          }
        })
        .catch(e => {
          // eslint-disable-next-line no-console
          console.error(e);
          scenarioController.log('info', e, componentName, {});
          process.exitCode = 1;
        })
    )
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error('Initiating ScenarioController failed', e);
      process.exitCode = 1;
    });
};
