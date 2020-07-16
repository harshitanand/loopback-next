// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-validation-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {
  RequestBodyValidationOptions,
  RestApplication,
  RestBindings,
} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class ValidationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    const validationOptions: RequestBodyValidationOptions = {
      $data: true,
      ajvKeywords: true,
      ajvErrors: true,
    };

    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      validation: validationOptions,
    });

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
