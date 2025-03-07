import datasourceFormData from "../../fixtures/datasources.json";
import { ObjectsRegistry } from "../Objects/Registry";
import { WIDGET } from "../../locators/WidgetLocators";

const DataSourceKVP = {
  Postgres: "PostgreSQL",
  Mongo: "MongoDB",
  MySql: "MySQL",
  UnAuthenticatedGraphQL: "GraphQL API",
  MsSql: "Microsoft SQL Server",
  Airtable: "Airtable",
  Arango: "ArangoDB",
  Firestore: "Firestore",
  Elasticsearch: "Elasticsearch",
  Redis: "Redis",
  Oracle: "Oracle",
}; //DataSources KeyValuePair

export enum Widgets {
  Dropdown,
  Table,
  Chart,
  Text,
}

interface RunQueryParams {
  toValidateResponse?: boolean;
  expectedStatus?: boolean;
  waitTimeInterval?: number;
}
export class DataSources {
  private agHelper = ObjectsRegistry.AggregateHelper;
  private table = ObjectsRegistry.Table;
  private ee = ObjectsRegistry.EntityExplorer;
  private locator = ObjectsRegistry.CommonLocators;
  private apiPage = ObjectsRegistry.ApiPage;

  private _dsCreateNewTab = "[data-testid=t--tab-CREATE_NEW]";
  private _addNewDataSource = ".t--entity-add-btn.datasources button";
  private _createNewPlgin = (pluginName: string) =>
    ".t--plugin-name:contains('" + pluginName + "')";
  private _collapseContainer = ".t--collapse-section-container";
  private _collapseSettings =
    "[data-testid='t--dropdown-connection.ssl.authType']";
  private _host = "input[name='datasourceConfiguration.endpoints[0].host']";
  private _port = "input[name='datasourceConfiguration.endpoints[0].port']";
  _databaseName =
    "input[name='datasourceConfiguration.authentication.databaseName']";
  private _username =
    "input[name='datasourceConfiguration.authentication.username']";
  private _section = (name: string) =>
    "//div[text()='" + name + "']/parent::div";
  private _sectionState = (name: string) =>
    this._section(name) +
    "/following-sibling::div/div[@class ='bp3-collapse-body']";
  private _password =
    "input[name = 'datasourceConfiguration.authentication.password']";
  private _testDs = ".t--test-datasource";
  _saveAndAuthorizeDS = ".t--save-and-authorize-datasource";
  _saveDs = ".t--save-datasource";
  _datasourceCard = ".t--datasource";
  _dsMenuoptions = "div.t--datasource-menu-option";
  _editButton = ".t--edit-datasource";
  _reconnectDataSourceModal = "[data-testid=t--tab-RECONNECT_DATASOURCES]";
  _closeDataSourceModal = ".t--reconnect-close-btn";
  _dsEntityItem = "[data-guided-tour-id='explorer-entity-Datasources']";
  _activeDS = "[data-testid='active-datasource-name']";
  _mockDatasourceName = "[data-testid=mockdatasource-name]";
  _templateMenu = ".t--template-menu";
  _templateMenuOption = (action: string) =>
    "//div[contains(@class, 't--template-menu')]//div[text()='" + action + "']";
  _createQuery = ".t--create-query";
  _visibleTextSpan = (spanText: string) =>
    "//span[contains(text(),'" + spanText + "')]";
  _dsOptionMenuItem = (text: string) =>
    "//div[@role='menuitem']//span[text()='" + text + "']";
  _dropdownTitle = (ddTitle: string) =>
    "//p[contains(text(),'" +
    ddTitle +
    "')]/ancestor::div[@class='form-config-top']/following-sibling::div[@class='t--form-control-DROP_DOWN']//input | //label[text()='" +
    ddTitle +
    "']/following-sibling::span//button";
  _reconnectModal = "[data-testid='reconnect-datasource-modal']";
  _dropdown = (ddTitle: string) =>
    "//span[contains(@title, '" +
    ddTitle +
    "') and text() = '" +
    ddTitle +
    "']";
  _activeDSListReconnectModal = (dbName: string) =>
    "//div[contains(@class, 't--ds-list')]//span[text()='" + dbName + "']";
  _runQueryBtn = ".t--run-query";
  _newDatabases = "#new-datasources";
  _newDatasourceContainer = "#new-integrations-wrapper";
  _selectDatasourceDropdown = "[data-testid=t--datasource-dropdown]";
  _selectTableDropdown =
    "[data-testid=t--table-dropdown] .rc-select-selection-item";
  _selectSheetNameDropdown = "[data-testid=t--sheetName-dropdown]";
  _selectTableHeaderIndexInput = "[data-testid=t--tableHeaderIndex]";
  _dropdownOption = ".rc-select-item-option-content";
  _generatePageBtn = "[data-testid=t--generate-page-form-submit]";
  _selectedRow = ".tr.selected-row";
  _activeTab = "span:contains('Active')";
  _selectedActiveTab = "li[aria-selected='true'] " + this._activeTab;
  _contextMenuDSReviewPage = "[data-testid='t--context-menu-trigger']";
  _contextMenuDelete = ".t--datasource-option-delete";
  _datasourceCardGeneratePageBtn = ".t--generate-template";
  _queryOption = (option: string) =>
    "//div[contains(@class, 'rc-select-item-option-content') and text() = '" +
    option +
    "'] | //a[contains(@class, 'single-select')]//div[text()='" +
    option +
    "']";
  _queryTableResponse =
    "//div[@data-guided-tour-id='query-table-response']//div[@class='tbody']//div[@class ='td']";
  _queryResponseHeader = (header: string) =>
    "//div[@data-guided-tour-id='query-table-response']//div[@class='table']//div[@role ='columnheader']//span[text()='" +
    header +
    "']";
  _refreshIcon = "button .bp3-icon-refresh";
  _addIcon = "button .bp3-icon-add";
  _queryError = "[data-testid='t--query-error']";
  _queryEditorTabs = (responseType: string) =>
    "//button[@role='tab' or @role='tablist']//span[text()='" +
    responseType +
    "']";
  _queryResponse = (responseType: string) =>
    "//div[@data-testid='t--response-tab-segmented-control']//span[text()='" +
    responseType +
    "']";
  _queryRecordResult = (recordCount: number) =>
    `//div/span[text()='Result:']/span[contains(text(),' ${recordCount} Record')]`;
  _noRecordFound = "span[data-testid='no-data-table-message']";
  _usePreparedStatement =
    "input[name='actionConfiguration.pluginSpecifiedTemplates[0].value'][type='checkbox']";
  _queriesOnPageText = (dsName: string) =>
    ".t--datasource-name:contains('" + dsName + "') .t--queries-for-DB";
  _mockDB = (dbName: string) =>
    "//span[text()='" +
    dbName +
    "']/ancestor::div[contains(@class, 't--mock-datasource')][1]";
  private _createBlankGraphQL = ".t--createBlankApiGraphqlCard";
  private _createBlankCurl = ".t--createBlankCurlCard";
  private _graphQLHeaderKey = "input[name='headers[0].key']";
  private _graphQLHeaderValue = "input[name='headers[0].value']";
  _graphqlQueryEditor = ".t--graphql-query-editor";
  _graphqlVariableEditor = ".t--graphql-variable-editor";
  _graphqlPagination = {
    _limitVariable: ".t--apiFormPaginationLimitVariable .rc-select-selector",
    _limitValue: ".t--apiFormPaginationLimitValue .CodeMirror textarea",
    _offsetVariable: ".t--apiFormPaginationOffsetVariable .rc-select-selector",
    _offsetValue: ".t--apiFormPaginationOffsetValue .CodeMirror textarea",
    _prevLimitVariable: ".t--apiFormPaginationPrevLimitVariable",
    _prevLimitValue: ".t--apiFormPaginationPrevLimitValue .CodeMirror textarea",
    _prevCursorVariable: ".t--apiFormPaginationPrevCursorVariable",
    _prevCursorValue:
      ".t--apiFormPaginationPrevCursorValue .CodeMirror textarea",
    _nextLimitVariable: ".t--apiFormPaginationNextLimitVariable",
    _nextLimitValue: ".t--apiFormPaginationNextLimitValue .CodeMirror textarea",
    _nextCursorVariable: ".t--apiFormPaginationNextCursorVariable",
    _nextCursorValue:
      ".t--apiFormPaginationNextCursorValue .CodeMirror textarea",
  };
  _queryDoc = ".t--datasource-documentation-link";
  _globalSearchModal = ".t--global-search-modal";
  _globalSearchInput = (inputText: string) =>
    "//input[@id='global-search'][@value='" + inputText + "']";
  _gsScopeDropdown =
    "[data-testid='datasourceConfiguration.authentication.scopeString']";
  _gsScopeOptions = ".ads-v2-select__dropdown .rc-select-item-option";
  private _queryTimeout =
    "//input[@name='actionConfiguration.timeoutInMillisecond']";
  _getStructureReq = "/api/v1/datasources/*/structure?ignoreCache=true";
  _editDatasourceFromActiveTab = (dsName: string) =>
    ".t--datasource-name:contains('" + dsName + "')";
  private _suggestedWidget = (widgetType: string) =>
    ".t--suggested-widget-" + widgetType + "";

  private _curlTextArea =
    "//label[text()='Paste CURL Code Here']/parent::form/div";
  _noSchemaAvailable = (dbName: string) =>
    "//div[text()='" +
    dbName +
    "']/ancestor::div[contains(@class, 't--entity-item')]/following-sibling::div//p[text()='Schema not available']";
  // Authenticated API locators
  private _authApiDatasource = ".t--createAuthApiDatasource";
  private _authType = "[data-testid=authType]";
  private _oauth2 = ".rc-select-item-option:contains('OAuth 2.0')";
  private _accessTokenUrl =
    "[data-testid='authentication.accessTokenUrl'] input";
  private _scope = "[data-testid='authentication.scopeString'] input";
  private _clientID = "[data-testid='authentication.clientId'] input";
  private _clientSecret = "[data-testid='authentication.clientSecret'] input";
  private _clientCredentails =
    ".rc-select-item-option:contains('Client Credentials')";
  private _authorizationCode =
    ".rc-select-item-option:contains('Authorization Code')";
  private _grantType = "[data-testid='authentication.grantType']";
  private _authorizationURL =
    "[data-testid='authentication.authorizationUrl'] input";
  private _consent = '[name="confirm"]';
  private _consentSubmit = "//button[text()='Submit']";
  public _datasourceModalSave = ".t--datasource-modal-save";
  public _datasourceModalDoNotSave = ".t--datasource-modal-do-not-save";
  public _cancelEditDatasourceButton = ".t--cancel-edit-datasource";
  public _urlInputControl = "input[name='url']";
  public _mongoCollectionPath = "t--actionConfiguration.formData.collection";
  private _getJSONswitchLocator = (fieldLocator: string) =>
    `[data-testid='${fieldLocator}.data-JS']`;
  _nestedWhereClauseKey = (index: number) =>
    ".t--actionConfiguration\\.formData\\.where\\.data\\.children\\[" +
    index +
    "\\]\\.key";
  _nestedWhereClauseValue = (index: number) =>
    ".t--actionConfiguration\\.formData\\.where\\.data\\.children\\[" +
    index +
    "\\]\\.value";
  _whereDelete = (index: number) =>
    "[data-testid='t--where-clause-delete-[" + index + "]']";

  _bodyCodeMirror = "//div[contains(@class, 't--actionConfiguration.body')]";

  public AssertDSEditViewMode(mode: "Edit" | "View") {
    if (mode == "Edit") this.agHelper.AssertElementAbsence(this._editButton);
    else if (mode == "View") this.agHelper.AssertElementExist(this._editButton);
  }

  public GeneratePageWithDB(datasourceName: any, tableName: string) {
    this.ee.AddNewPage("Generate page with data");
    this.agHelper.GetNClick(this._selectDatasourceDropdown);
    this.agHelper.GetNClickByContains(
      this.locator._dropdownText,
      datasourceName,
    );
    this.agHelper.GetNClick(this._selectTableDropdown, 0, true);
    cy.get(
      `div[role="listbox"] p[kind="span"]:contains("${tableName}")`,
    ).click();
    this.agHelper.GetNClick(this._generatePageBtn);
    this.agHelper.ValidateNetworkStatus("@replaceLayoutWithCRUDPage", 201);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Got it"));
  }

  public GeneratePageWithMockDB() {
    this.ee.AddNewPage("Generate page with data");
    this.agHelper.GetNClick(this._selectDatasourceDropdown);
    this.agHelper.GetNClick(this.locator._dropdownText, 0);
    this.agHelper.GetNClickByContains(this._mockDatasourceName, "Users");
    this.agHelper.ValidateNetworkStatus("@getDatasourceStructure");
    this.agHelper.GetNClick(this._selectTableDropdown, 0, true);
    cy.get(
      `div[role="listbox"] p[kind="span"]:contains("public.users")`,
    ).click();
    this.agHelper.GetNClick(this._generatePageBtn);
    this.agHelper.ValidateNetworkStatus("@replaceLayoutWithCRUDPage", 201);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Got it"));
  }

  public StartDataSourceRoutes() {
    cy.intercept("POST", "/api/v1/datasources").as("saveDatasource");
    cy.intercept("POST", "/api/v1/datasources/test").as("testDatasource");
    cy.intercept("PUT", "/api/v1/datasources/*").as("updateDatasource");
  }

  private ReplaceApplicationIdForInterceptPages(fixtureFile: any) {
    let currentAppId, currentURL;
    cy.readFile(
      fixtureFile,
      // (err: string) => {
      // if (err) {
      //   return console.error(err);
      // }}
    ).then((data) => {
      cy.url().then((url) => {
        currentURL = url;
        const myRegexp = /applications(.*)/;
        const match = myRegexp.exec(currentURL);
        cy.log(currentURL + "currentURL from intercept is");
        currentAppId = match ? match[1].split("/")[1] : null;
        data.data.page.applicationId = currentAppId;
        cy.writeFile(fixtureFile, JSON.stringify(data));
      });
    });
  }

  public StartInterceptRoutesForMySQL() {
    //All stubbing - updating app id to current app id for Delete app by api call to be successfull:

    this.ReplaceApplicationIdForInterceptPages(
      "cypress/fixtures/mySQL_PUT_replaceLayoutWithCRUD.json",
    );

    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.intercept("GET", "/api/v1/datasources/*/structure?ignoreCache=*", {
      fixture: "mySQL_GET_selectTableDropdown.json",
    }).as("getDatasourceStructure");
    cy.intercept("PUT", "/api/v1/pages/crud-page/*", {
      fixture: "mySQL_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
    cy.intercept("GET", "/api/v1/actions*", {
      fixture: "mySQL_GET_Actions.json",
    }).as("getActions");
    cy.intercept("POST", "/api/v1/actions/execute", {
      fixture: "mySQL_POST_Execute.json",
    }).as("postExecute");
    cy.intercept("POST", "/api/v1/pages/crud-page", {
      fixture: "mySQL_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
  }

  public StartInterceptRoutesForMongo() {
    //All stubbing
    this.ReplaceApplicationIdForInterceptPages(
      "cypress/fixtures/mongo_PUT_replaceLayoutWithCRUD.json",
    );

    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.intercept("GET", "/api/v1/datasources/*/structure?ignoreCache=*", {
      fixture: "mongo_GET_selectTableDropdown.json",
    }).as("getDatasourceStructure");
    cy.intercept("PUT", "/api/v1/pages/crud-page/*", {
      fixture: "mongo_PUT_replaceLayoutWithCRUD.json",
    }).as("replaceLayoutWithCRUDPage");
    cy.intercept("GET", "/api/v1/actions*", {
      fixture: "mongo_GET_Actions.json",
    }).as("getActions");
    cy.intercept("POST", "/api/v1/actions/execute", {
      fixture: "mongo_POST_Actions.json",
    }).as("postExecute");
    cy.intercept("POST", "/api/v1/pages/crud-page", {
      fixture: "mongo_PUT_replaceLayoutWithCRUD.json",
    }).as("post_replaceLayoutCRUDStub");
  }

  public StartInterceptRoutesForFirestore() {
    //All stubbing
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
  }

  public CreatePlugIn(pluginName: string, waitForToastDisappear = false) {
    cy.get(this._createNewPlgin(pluginName))
      .parent("div")
      .trigger("click", { force: true });
    this.agHelper.Sleep();
    //this.agHelper.WaitUntilEleAppear(this.locator._toastMsg);
    this.agHelper.AssertElementAbsence(
      this.locator._specificToast("Duplicate key error"),
    );
    this.agHelper.PressEscape();
    // if (waitForToastDisappear)
    //   this.agHelper.WaitUntilToastDisappear("datasource created");
    // else this.agHelper.AssertContains("datasource created");
  }

  public EditDatasource() {
    this.agHelper.GetNClick(this._editButton);
  }

  public ExpandSection(index: number) {
    cy.get(this._collapseContainer).eq(index).click();
    cy.get(this._collapseSettings).should("be.visible");
  }

  public ExpandSectionByName(sectionName: string) {
    // Click on collapse section only if it collapsed, if it is expanded we ignore
    this.agHelper
      .GetElement(this._sectionState(sectionName))
      .invoke("attr", "aria-hidden")
      .then((hidden: any) => {
        if (hidden == "true") {
          this.agHelper.GetNClick(this._section(sectionName));
        }
      });
  }

  public AssertSectionCollapseState(index: number, collapsed = false) {
    if (collapsed) {
      cy.get(this._collapseSettings).should("not.be.visible");
    } else {
      cy.get(this._collapseSettings).should("be.visible");
    }
  }

  public NavigateToDSCreateNew() {
    this.ee.HoverOnEntityItem("Datasources");
    Cypress._.times(2, () => {
      this.agHelper.GetNClick(this._addNewDataSource, 0, true);
      this.agHelper.Sleep();
    });

    // cy.get(this._dsCreateNewTab)
    //   .should("be.visible")
    //   .click({ force: true });
    cy.get(this._newDatasourceContainer).scrollTo("bottom", {
      ensureScrollable: false,
    });
    cy.get(this._newDatabases).should("be.visible");
  }

  CreateMockDB(dbName: "Users" | "Movies"): Cypress.Chainable<string> {
    this.NavigateToDSCreateNew();
    this.agHelper.GetNClick(this._mockDB(dbName));
    return cy
      .wait("@getMockDb")
      .then(($createdMock) => $createdMock.response?.body.data.name);
  }

  public FillPostgresDSForm(
    shouldAddTrailingSpaces = false,
    username = "",
    password = "",
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? datasourceFormData["postgres-host"] + "  "
      : datasourceFormData["postgres-host"];
    const databaseName = shouldAddTrailingSpaces
      ? datasourceFormData["postgres-databaseName"] + "  "
      : datasourceFormData["postgres-databaseName"];
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["postgres-port"].toString(),
    );
    cy.get(this._databaseName).clear().type(databaseName);
    this.ExpandSectionByName("Authentication");
    cy.get(this._username).type(
      username == "" ? datasourceFormData["postgres-username"] : username,
    );
    cy.get(this._password).type(
      password == "" ? datasourceFormData["postgres-password"] : password,
    );
  }

  public FillOracleDSForm(
    shouldAddTrailingSpaces = false,
    username = "",
    password = "",
  ) {
    const hostAddress = shouldAddTrailingSpaces
      ? datasourceFormData["oracle-host"] + "  "
      : datasourceFormData["oracle-host"];
    const databaseName = shouldAddTrailingSpaces
      ? datasourceFormData["oracle-name"] + "  "
      : datasourceFormData["oracle-name"];
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["oracle-port"].toString(),
    );
    cy.get(this._databaseName).clear().type(databaseName);
    this.ExpandSectionByName("Authentication");
    cy.get(this._username).type(
      username == "" ? datasourceFormData["oracle-username"] : username,
    );
    cy.get(this._password).type(
      password == "" ? datasourceFormData["oracle-password"] : password,
    );
  }

  public FillMongoDSForm(shouldAddTrailingSpaces = false) {
    const hostAddress = shouldAddTrailingSpaces
      ? datasourceFormData["mongo-host"] + "  "
      : datasourceFormData["mongo-host"];
    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["mongo-port"].toString(),
    );
    this.ExpandSectionByName("Authentication");
    cy.get(this._databaseName)
      .clear()
      .type(datasourceFormData["mongo-databaseName"]);
  }

  public FillMySqlDSForm(shouldAddTrailingSpaces = false) {
    const hostAddress = shouldAddTrailingSpaces
      ? datasourceFormData["mysql-host"] + "  "
      : datasourceFormData["mysql-host"];
    const databaseName = shouldAddTrailingSpaces
      ? datasourceFormData["mysql-databaseName"] + "  "
      : datasourceFormData["mysql-databaseName"];

    this.agHelper.UpdateInputValue(this._host, hostAddress);
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["mysql-port"].toString(),
    );
    cy.get(this._databaseName).clear().type(databaseName);
    this.ExpandSectionByName("Authentication");
    cy.get(this._username).type(datasourceFormData["mysql-username"]);
    cy.get(this._password).type(datasourceFormData["mysql-password"]);
  }

  public FillMsSqlDSForm() {
    this.agHelper.UpdateInputValue(
      this._host,
      datasourceFormData["mssql-host"],
    );
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["mssql-port"].toString(),
    );
    this.agHelper.ClearTextField(this._databaseName);
    // this.agHelper.UpdateInputValue(
    //   this._databaseName,
    //   datasourceFormData["mssql-databaseName"],
    // ); //Commenting until MsSQL is init loaded into container
    this.ExpandSectionByName("Authentication");
    this.agHelper.UpdateInputValue(
      this._username,
      datasourceFormData["mssql-username"],
    );
    this.agHelper.UpdateInputValue(
      this._password,
      datasourceFormData["mssql-password"],
    );
  }

  public FillAirtableDSForm() {
    this.ValidateNSelectDropdown(
      "Authentication type",
      "Please select an option",
      "Bearer token",
    );
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Bearer token"),
      Cypress.env("AIRTABLE_BEARER"),
    );
    this.agHelper.Sleep();
  }

  public FillArangoDSForm() {
    this.agHelper.UpdateInputValue(
      this._host,
      datasourceFormData["arango-host"],
    );
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["arango-port"].toString(),
    );
    //Validating db name is _system, currently unable to create DB via curl in Arango
    this.agHelper
      .GetText(this._databaseName, "val")
      .then(($dbName) => expect($dbName).to.eq("_system"));
    this.ExpandSectionByName("Authentication");
    this.agHelper.UpdateInputValue(
      this._username,
      datasourceFormData["arango-username"],
    );
    this.agHelper.UpdateInputValue(
      this._password,
      datasourceFormData["arango-password"],
    );
  }

  public FillCurlNImport(value: string) {
    this.NavigateToDSCreateNew();
    this.agHelper.GetNClick(this._createBlankCurl);
    this.ImportCurlNRun(value);
  }

  public ImportCurlNRun(value: string) {
    this.agHelper.UpdateTextArea(this._curlTextArea, value);
    this.agHelper.Sleep(500); //Clicking import after value settled
    this.agHelper.ClickButton("Import");
    this.apiPage.RunAPI();
  }

  public FillFirestoreDSForm() {
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Database URL"),
      datasourceFormData["firestore-database-url"],
    );
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Project Id"),
      datasourceFormData["firestore-projectID"],
    );
    // cy.fixture("firestore-ServiceAccCreds").then((json: any) => {
    //   let ServiceAccCreds = JSON.parse(
    //     JSON.stringify(json.serviceAccCredentials),
    //   );
    //   ServiceAccCreds.private_key = Cypress.env("FIRESTORE_PRIVATE_KEY");
    //   //cy.log("ServiceAccCreds is " + JSON.stringify(ServiceAccCreds));
    //   cy.log(
    //     "ServiceAccCreds.private_key  is " +
    //       JSON.stringify(ServiceAccCreds.private_key),
    //   );
    this.agHelper.UpdateFieldLongInput(
      this.locator._inputFieldByName("Service account credentials"),
      JSON.stringify(Cypress.env("FIRESTORE_PRIVATE_KEY")),
    );
    //});
  }

  public FillElasticSearchDSForm() {
    this.agHelper.UpdateInputValue(
      this._host,
      datasourceFormData["elastic-host"],
    );

    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["elastic-port"].toString(),
    );
    this.ExpandSectionByName("Authentication");
    this.agHelper.UpdateInputValue(
      this._username,
      datasourceFormData["elastic-username"],
    );
    this.agHelper.UpdateInputValue(
      this._password,
      datasourceFormData["elastic-password"],
    );
  }

  public FillUnAuthenticatedGraphQLDSForm() {
    this.agHelper.GetNClick(this._createBlankGraphQL);
    this.apiPage.EnterURL(datasourceFormData.GraphqlApiUrl_TED);
    this.agHelper.ValidateNetworkStatus("@createNewApi", 201);
  }

  public CreateNFillAuthenticatedGraphQLDSForm(
    dataSourceName: string,
    hKey: string,
    hValue: string,
  ) {
    this.NavigateToDSCreateNew();
    this.CreatePlugIn("Authenticated GraphQL API");
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("URL"),
      datasourceFormData.GraphqlApiUrl_TED,
    );

    this.agHelper.UpdateInputValue(this._graphQLHeaderKey, hKey);
    this.agHelper.UpdateInputValue(this._graphQLHeaderValue, hValue);
    cy.get("@guid").then((uid: any) => {
      dataSourceName = dataSourceName + " " + uid;
      this.agHelper.RenameWithInPane(dataSourceName, false);
      this.SaveDatasource();
      cy.wrap(dataSourceName).as("dsName");
    });
  }

  public FillRedisDSForm() {
    this.agHelper.UpdateInputValue(
      this._host,
      datasourceFormData["redis-host"],
    );
    this.agHelper.UpdateInputValue(
      this._port,
      datasourceFormData["redis-port"].toString(),
    );
  }

  public TestSaveDatasource(expectedRes = true) {
    this.TestDatasource(expectedRes);
    this.SaveDatasource();
  }

  public TestDatasource(expectedRes = true) {
    this.agHelper.GetNClick(this._testDs, 0, false, 0);
    this.agHelper.ValidateNetworkDataSuccess("@testDatasource", expectedRes);
    if (expectedRes) {
      this.agHelper.AssertContains("datasource is valid");
    }
  }

  public SaveDatasource() {
    this.agHelper.GetNClick(this._saveDs);
    this.agHelper.ValidateNetworkStatus("@saveDatasource", 201);
    this.agHelper.AssertContains("datasource created");

    // cy.wait("@saveDatasource")
    //     .then((xhr) => {
    //         cy.log(JSON.stringify(xhr.response!.body));
    //     }).should("have.nested.property", "response.body.responseMeta.status", 200);
  }

  public AuthAPISaveAndAuthorize() {
    cy.get(this._saveAndAuthorizeDS).click();
    this.agHelper.ValidateNetworkStatus("@saveDatasource", 201);
  }

  public UpdateDatasource() {
    this.agHelper.GetNClick(this._saveDs);
    // this.agHelper.ValidateNetworkStatus("@updateDatasource", 200);
    this.agHelper.AssertContains("datasource updated");
  }

  public ClickActiveTabDSContextMenu(datasourceName: string) {
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(datasourceName)
      .parents(this._datasourceCard)
      .find(this._dsMenuoptions)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  public DeleteDatasouceFromActiveTab(
    datasourceName: string,
    expectedRes = 200 || 409 || [200 | 409],
  ) {
    this.ClickActiveTabDSContextMenu(datasourceName);
    this.agHelper.GetNClick(this._dsOptionMenuItem("Delete"), 0, false, 200);
    this.agHelper.GetNClick(this._dsOptionMenuItem("Are you sure?"));
    this.ValidateDSDeletion(expectedRes);
  }

  public DeleteDatasouceFromWinthinDS(
    datasourceName: string,
    expectedRes: number | number[] = 200 || 409 || [200 | 409],
  ) {
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(datasourceName)
      .scrollIntoView()
      .should("be.visible")
      .click();
    this.agHelper.Sleep(); //for the Datasource page to open
    this.DeleteDSDirectly(expectedRes);
  }

  public DeleteDSDirectly(
    expectedRes: number | number[] = 200 || 409 || [200 | 409],
  ) {
    this.agHelper.GetNClick(this._cancelEditDatasourceButton, 0, false, 200);
    cy.get(this._contextMenuDSReviewPage).click({ force: true });
    this.agHelper.GetNClick(this._contextMenuDelete);
    this.agHelper.GetNClick(this.locator._visibleTextSpan("Are you sure?"));
    this.ValidateDSDeletion(expectedRes);
  }
  public ValidateDSDeletion(expectedRes: number | number[] = 200) {
    let toValidateRes = expectedRes == 200 || expectedRes == 409 ? true : false;
    if (toValidateRes) {
      if (expectedRes == 200)
        this.agHelper.AssertContains("datasource deleted successfully");
      else this.agHelper.AssertContains("action(s) using it.");
      this.agHelper.ValidateNetworkStatus(
        "@deleteDatasource",
        expectedRes as number,
      );
    } else {
      cy.wait("@deleteDatasource").should((response: any) => {
        expect(response.status).to.be.oneOf([200, 409]);
      });
    }
  }

  public NavigateToActiveTab() {
    this.agHelper.GetElement(this.locator._body).then(($body) => {
      if ($body.find(this._selectedActiveTab).length == 0) {
        this.NavigateToDSCreateNew();
        this.agHelper.GetNClick(this._activeTab, 0, true);
      }
    });
  }

  public NavigateFromActiveDS(datasourceName: string, createQuery: boolean) {
    const btnLocator =
      createQuery == true
        ? this._createQuery
        : this._datasourceCardGeneratePageBtn;

    this.ee.NavigateToSwitcher("Explorer", 0, true);
    this.ee.ExpandCollapseEntity("Datasources", false);
    //this.ee.SelectEntityByName(datasourceName, "Datasources");
    //this.ee.ExpandCollapseEntity(datasourceName, false);
    this.NavigateToActiveTab();
    cy.get(this._datasourceCard)
      .contains(datasourceName)
      .scrollIntoView()
      .should("be.visible")
      .closest(this._datasourceCard)
      .within(() => {
        cy.get(btnLocator).click({ force: true });
      });
    this.agHelper.Sleep(2000); //for the CreateQuery/GeneratePage page to load
  }

  public CreateQueryFromActiveTab(
    datasourceName: string,
    toNavigateToActive = true,
  ) {
    if (toNavigateToActive) this.NavigateToActiveTab();
    cy.get(this._datasourceCard, { withinSubject: null })
      .find(this._activeDS)
      .contains(datasourceName)
      .scrollIntoView()
      .should("be.visible")
      .closest(this._datasourceCard)
      .scrollIntoView()
      .within(() => {
        cy.get(this._createQuery).click({ force: true });
      });
    this.agHelper.Sleep(2000); //for the CreateQuery
  }

  CreateQueryAfterDSSaved(query = "", queryName = "") {
    this.agHelper.GetNClick(this._createQuery);
    if (queryName) this.agHelper.RenameWithInPane(queryName);
    if (query) {
      this.agHelper.GetNClick(this._templateMenu);
      this.EnterQuery(query);
    }
  }

  DeleteQuery(queryName: string) {
    this.ee.ExpandCollapseEntity("Queries/JS");
    this.ee.ActionContextMenuByEntityName(queryName, "Delete", "Are you sure?");
  }

  public ValidateNSelectDropdown(
    ddTitle: string,
    currentValue: string,
    newValue = "",
  ) {
    if (currentValue)
      cy.xpath(this._visibleTextSpan(currentValue))
        //.scrollIntoView()
        .should("exist", currentValue + " dropdown value not present");
    if (newValue != "") {
      this.agHelper.GetNClick(this._dropdownTitle(ddTitle));
      //cy.xpath(this._dropdown(currentValue)).last().click({ force: true });
      //to expand the dropdown
      //this.agHelper.GetNClick(this._queryOption(newValue))
      cy.xpath(this._queryOption(newValue)).last().click({ force: true }); //to select the new value
    }
  }

  public ReconnectDataSource(dbName: string, dsName: "PostgreSQL" | "MySQL") {
    this.agHelper.AssertElementVisible(this._reconnectModal);
    this.agHelper.AssertElementVisible(this._testDs); //Making sure modal is fully loaded
    cy.xpath(this._activeDSListReconnectModal(dsName)).should("be.visible");
    cy.xpath(this._activeDSListReconnectModal(dbName)).should("be.visible"); //.click()
    this.ValidateNSelectDropdown("Connection mode", "Read / Write");
    if (dsName == "PostgreSQL") this.FillPostgresDSForm();
    else if (dsName == "MySQL") this.FillMySqlDSForm();
    cy.get(this._saveDs).click();
  }

  RunQuery({
    expectedStatus = true,
    toValidateResponse = true,
    waitTimeInterval = 500,
  }: Partial<RunQueryParams> = {}) {
    this.agHelper.GetNClick(this._runQueryBtn, 0, true, waitTimeInterval);
    if (toValidateResponse) {
      this.agHelper.AssertElementAbsence(
        this.locator._cancelActionExecution,
        10000,
      ); //For the run to give response
      this.agHelper.Sleep();
      this.agHelper.ValidateNetworkExecutionSuccess(
        "@postExecute",
        expectedStatus,
      );
    }
  }

  AssertRunButtonDisability(disabled = false) {
    let query = "";
    if (disabled) {
      query = "be.disabled";
    } else {
      query = "not.be.disabled";
    }
    cy.get(this._runQueryBtn).should(query);
  }

  public ReadQueryTableResponse(index: number, timeout = 100) {
    //timeout can be sent higher values incase of larger tables
    this.agHelper.Sleep(timeout); //Settling time for table!
    return cy.xpath(this._queryTableResponse).eq(index).invoke("text");
  }

  public AssertQueryResponseHeaders(columnHeaders: string[]) {
    columnHeaders.forEach(($header) =>
      this.agHelper.AssertElementVisible(this._queryResponseHeader($header)),
    );
  }

  public AssertJSONFormHeader(
    rowindex: number,
    colIndex: number,
    headerString: string,
    validateCellData: "" | string = "",
    isMongo = false,
  ) {
    let jsonHeaderString = "";
    this.table.ReadTableRowColumnData(rowindex, colIndex).then(($cellData) => {
      if (validateCellData) expect($cellData).to.eq(validateCellData);

      jsonHeaderString =
        isMongo == true
          ? "Update Document " + headerString + ": " + $cellData
          : "Update Row " + headerString + ": " + $cellData;
      this.agHelper
        .GetText(this.locator._jsonFormHeader)
        .then(($header: any) => expect($header).to.eq(jsonHeaderString));
    });
  }

  public ToggleUsePreparedStatement(enable = true || false) {
    if (enable)
      cy.get(this._usePreparedStatement).check({
        force: true,
      });
    else
      cy.get(this._usePreparedStatement).uncheck({
        force: true,
      });

    this.agHelper.AssertAutoSave();
  }

  public EnterQuery(query: string, sleep = 500) {
    this.agHelper.UpdateCodeInput(this.locator._codeEditorTarget, query);
    this.agHelper.AssertAutoSave();
    this.agHelper.Sleep(sleep); //waiting a bit before proceeding!
    cy.wait("@saveAction");
  }

  public RunQueryNVerifyResponseViews(
    expectedRecordsCount = 1,
    tableCheck = true,
  ) {
    this.RunQuery();
    tableCheck &&
      this.agHelper.AssertElementVisible(this._queryResponse("TABLE"));
    this.agHelper.AssertElementVisible(this._queryResponse("JSON"));
    this.agHelper.AssertElementVisible(this._queryResponse("RAW"));
    this.CheckResponseRecordsCount(expectedRecordsCount);
  }

  public CheckResponseRecordsCount(expectedRecordCount: number) {
    this.agHelper.AssertElementVisible(
      this._queryRecordResult(expectedRecordCount),
    );
  }

  public CreateDataSource(
    dsType:
      | "Postgres"
      | "Mongo"
      | "MySql"
      | "UnAuthenticatedGraphQL"
      | "MsSql"
      | "Airtable"
      | "Arango"
      | "Firestore"
      | "Elasticsearch"
      | "Redis"
      | "Oracle",
    navigateToCreateNewDs = true,
    testNSave = true,
  ) {
    let guid: any;
    let dataSourceName = "";
    this.agHelper.GenerateUUID();
    navigateToCreateNewDs && this.NavigateToDSCreateNew();

    cy.get("@guid").then((uid) => {
      if (DataSourceKVP[dsType] != "GraphQL API") {
        this.CreatePlugIn(DataSourceKVP[dsType]);
        guid = uid;
        dataSourceName = dsType + " " + guid;
        this.agHelper.RenameWithInPane(dataSourceName, false);
        if (DataSourceKVP[dsType] == "PostgreSQL") this.FillPostgresDSForm();
        else if (DataSourceKVP[dsType] == "Oracle") this.FillOracleDSForm();
        else if (DataSourceKVP[dsType] == "MySQL") this.FillMySqlDSForm();
        else if (DataSourceKVP[dsType] == "MongoDB") this.FillMongoDSForm();
        else if (DataSourceKVP[dsType] == "Microsoft SQL Server")
          this.FillMsSqlDSForm();
        else if (DataSourceKVP[dsType] == "Airtable") this.FillAirtableDSForm();
        else if (DataSourceKVP[dsType] == "ArangoDB") this.FillArangoDSForm();
        else if (DataSourceKVP[dsType] == "Firestore")
          this.FillFirestoreDSForm();
        else if (DataSourceKVP[dsType] == "Elasticsearch")
          this.FillElasticSearchDSForm();
        else if (DataSourceKVP[dsType] == "Redis") this.FillRedisDSForm();

        if (testNSave) {
          this.TestSaveDatasource();
        } else {
          this.SaveDatasource();
        }
      } else if (DataSourceKVP[dsType] == "GraphQL API")
        this.FillUnAuthenticatedGraphQLDSForm();
      cy.wrap(dataSourceName).as("dsName");
    });
  }

  public CreateQueryFromOverlay(
    dsName: string,
    query = "",
    queryName = "",
    sleep = 500,
  ) {
    this.agHelper.ClickOutside(); //to close the evaluated pop-up
    this.ee.CreateNewDsQuery(dsName);
    if (query) {
      this.agHelper.GetNClick(this._templateMenu);
      this.EnterQuery(query, sleep);
    }
    if (queryName) this.agHelper.RenameWithInPane(queryName);
  }

  public UpdateGraphqlQueryAndVariable(options?: {
    query?: string;
    variable?: string;
  }) {
    if (options?.query) {
      this.agHelper.UpdateCodeInput(this._graphqlQueryEditor, options.query);
    }

    if (options?.variable) {
      this.agHelper.UpdateCodeInput(
        this._graphqlVariableEditor,
        options.variable as string,
      );
    }

    this.agHelper.Sleep();
  }

  public UpdateGraphqlPaginationParams(options: {
    limit?: {
      variable: string;
      value: any;
    };
    offset?: {
      variable: string;
      value: any;
    };
  }) {
    if (options.limit) {
      // Select Limit variable from dropdown
      cy.get(this._graphqlPagination._limitVariable).click({
        force: true,
      });
      cy.get(".rc-select-item-option")
        .contains(options.limit.variable)
        .click({ force: true });

      // Set the Limit value as 1
      cy.get(this._graphqlPagination._limitValue)
        .first()
        .focus()
        .type(options.limit.value);
    }

    if (options.offset) {
      // Select Offset vaiable from dropdown
      cy.get(this._graphqlPagination._offsetVariable).click({
        force: true,
      });
      cy.get(".rc-select-item-option")
        .eq(2)
        .contains(options.offset.variable)
        .click({ force: true });

      // Set the Limit value as 1
      cy.get(this._graphqlPagination._offsetValue)
        .first()
        .focus()
        .type(options.offset.value);
    }

    this.agHelper.Sleep();
  }

  public SetQueryTimeout(queryTimeout = 20000) {
    this.agHelper.GetNClick(this._queryEditorTabs("Settings"));
    cy.xpath(this._queryTimeout)
      .clear()
      .type(queryTimeout.toString(), { delay: 0 }); //Delay 0 to work like paste!
    this.agHelper.AssertAutoSave();
    this.agHelper.GetNClick(this._queryEditorTabs("Query"));
  }

  //Update with new password in the datasource conf page
  public UpdatePassword(newPassword: string) {
    this.ExpandSectionByName("Authentication");
    cy.get(this._password).type(newPassword);
  }

  //Fetch schema from server and validate UI for the updates
  public VerifySchema(
    dataSourceName: string,
    schema: string,
    isUpdate = false,
  ) {
    cy.intercept("GET", this._getStructureReq).as("getDSStructure");
    if (isUpdate) {
      this.UpdateDatasource();
    } else {
      this.SaveDatasource();
    }
    this.ee.ActionContextMenuByEntityName(dataSourceName, "Refresh");
    cy.wait("@getDSStructure").then(() => {
      cy.get(".bp3-collapse-body").contains(schema);
    });
  }

  public SaveDSFromDialog(save = true) {
    this.agHelper.GoBack();
    this.agHelper.AssertElementVisible(this._datasourceModalDoNotSave);
    this.agHelper.AssertElementVisible(this._datasourceModalSave);
    if (save) {
      this.agHelper.GetNClick(
        this.locator._visibleTextSpan("Save"),
        0,
        true,
        0,
      );
      this.agHelper.ValidateNetworkStatus("@saveDatasource", 201);
      this.agHelper.AssertContains("datasource created");
    } else
      this.agHelper.GetNClick(
        this.locator._visibleTextSpan("Don't save"),
        0,
        true,
        0,
      );
  }

  public getDSEntity(dSName: string) {
    return `[data-guided-tour-id="explorer-entity-${dSName}"]`;
  }

  public FillAuthAPIUrl() {
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("URL"),
      datasourceFormData.authenticatedApiUrl,
    );
  }

  public AssertCursorPositionForTextInput(
    selector: string,
    moveCursor: string,
    typeText = "as",
    cursorPosition = 0,
  ) {
    this.agHelper
      .GetElement(selector)
      .type(moveCursor)
      .type(typeText)
      .should("have.prop", "selectionStart", cursorPosition);
  }

  public AddOAuth2AuthorizationCodeDetails(
    accessTokenUrl: string,
    clientId: string,
    clientSecret: string,
    authURL: string,
  ) {
    this.agHelper.GetNClick(this._authType);
    this.agHelper.GetNClick(this._oauth2);
    this.agHelper.GetNClick(this._grantType);
    this.agHelper.GetNClick(this._authorizationCode);
    this.agHelper.TypeText(this._accessTokenUrl, accessTokenUrl);
    this.agHelper.TypeText(this._clientID, clientId);
    this.agHelper.TypeText(this._clientSecret, clientSecret);
    this.agHelper.TypeText(this._authorizationURL, authURL);
  }

  public EditDSFromActiveTab(dsName: string) {
    this.agHelper.GetNClick(this._editDatasourceFromActiveTab(dsName));
  }

  public FillMongoDatasourceFormWithURI(uri: string) {
    this.ValidateNSelectDropdown(
      "Use mongo connection string URI",
      "No",
      "Yes",
    );
    this.agHelper.UpdateInputValue(
      this.locator._inputFieldByName("Connection string URI") + "//input",
      uri,
    );
  }

  public CreateOAuthClient(grantType: string) {
    let clientId, clientSecret;

    // Login to TED OAuth
    let formData = new FormData();
    formData.append("username", datasourceFormData["OAuth_Username"]);
    cy.request("POST", datasourceFormData["OAuth_Host"], formData).then(
      (response) => {
        expect(response.status).to.equal(200);
      },
    );

    // Create client
    let clientData = new FormData();
    clientData.append("client_name", "appsmith_cs_post");
    clientData.append("client_uri", "http://localhost/");
    clientData.append("scope", "profile");
    clientData.append("redirect_uri", datasourceFormData["OAuth_RedirectUrl"]);
    clientData.append("grant_type", grantType);
    clientData.append("response_type", "code");
    clientData.append("token_endpoint_auth_method", "client_secret_post");
    cy.request(
      "POST",
      datasourceFormData["OAuth_Host"] + "/create_client",
      clientData,
    ).then((response) => {
      expect(response.status).to.equal(200);
    });

    // Get Client Credentials
    cy.request("GET", datasourceFormData["OAuth_Host"]).then((response) => {
      clientId = response.body.split("client_id: </strong>");
      clientId = clientId[1].split("<strong>client_secret: </strong>");
      clientSecret = clientId[1].split("<strong>");
      clientSecret = clientSecret[0].trim();
      clientId = clientId[0].trim();
      cy.wrap(clientId).as("OAuthClientID");
      cy.wrap(clientSecret).as("OAuthClientSecret");
    });
  }

  public CreateOAuthDatasource(
    datasourceName: string,
    grantType: "ClientCredentials" | "AuthCode",
    clientId: string,
    clientSecret: string,
  ) {
    this.NavigateToDSCreateNew();
    //Click on Authenticated API
    this.agHelper.GetNClick(this._authApiDatasource, 0, true);
    this.FillAPIOAuthForm(datasourceName, grantType, clientId, clientSecret);

    // save datasource
    this.agHelper.Sleep(500);
    this.agHelper.GetNClick(this._saveAndAuthorizeDS);

    //Accept consent
    this.agHelper.GetNClick(this._consent);
    this.agHelper.GetNClick(this._consentSubmit);

    //Validate save
    this.agHelper.ValidateNetworkStatus("@saveDatasource", 201);
  }

  public FillAPIOAuthForm(
    dsName: string,
    grantType: "ClientCredentials" | "AuthCode",
    clientId: string,
    clientSecret: string,
  ) {
    if (dsName) this.agHelper.RenameWithInPane(dsName, false);
    // Fill Auth Form
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("URL"),
      datasourceFormData["OAuth_ApiUrl"],
    );
    this.agHelper.GetNClick(this._authType);
    this.agHelper.GetNClick(this._oauth2);
    this.agHelper.GetNClick(this._grantType);
    if (grantType == "ClientCredentials")
      this.agHelper.GetNClick(this._clientCredentails);
    else if (grantType == "AuthCode")
      this.agHelper.GetNClick(this._authorizationCode);

    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Access token URL"),
      datasourceFormData["OAUth_AccessTokenUrl"],
    );

    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Client ID"),
      clientId,
    );
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Client secret"),
      clientSecret,
    );
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Scope(s)"),
      "profile",
    );
    this.agHelper.UpdateInput(
      this.locator._inputFieldByName("Authorization URL"),
      datasourceFormData["OAuth_AuthUrl"],
    );
  }

  public AddSuggesstedWidget(widget: Widgets) {
    switch (widget) {
      case Widgets.Dropdown:
        this.agHelper.GetNClick(this._suggestedWidget("SELECT_WIDGET"));
        this.agHelper.AssertElementVisible(
          this.locator._widgetInCanvas(WIDGET.SELECT),
        );
        break;
      case Widgets.Table:
        this.agHelper.GetNClick(this._suggestedWidget("TABLE_WIDGET_V2"));
        this.agHelper.AssertElementVisible(
          this.locator._widgetInCanvas(WIDGET.TABLE),
        );
        break;
      case Widgets.Chart:
        this.agHelper.GetNClick(this._suggestedWidget("CHART_WIDGET"));
        this.agHelper.AssertElementVisible(
          this.locator._widgetInCanvas(WIDGET.CHART),
        );
        break;
      case Widgets.Text:
        this.agHelper.GetNClick(this._suggestedWidget("TEXT_WIDGET"));
        this.agHelper.AssertElementVisible(
          this.locator._widgetInCanvas(WIDGET.TEXT),
        );
        break;
    }
  }

  public EnterJSContext({
    fieldLabel,
    fieldProperty,
    fieldValue,
  }: {
    fieldProperty: string;
    fieldValue: string;
    fieldLabel: string;
  }) {
    this.agHelper.GetNClick(this._getJSONswitchLocator(fieldProperty));
    this.agHelper.EnterValue(fieldValue, {
      propFieldName: "",
      directInput: false,
      inputFieldName: fieldLabel,
    });
  }
}
