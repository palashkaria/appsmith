const queryLocators = require("../../../../locators/QueryEditor.json");
const generatePage = require("../../../../locators/GeneratePage.json");
const datasource = require("../../../../locators/DatasourcesEditor.json");
const formControls = require("../../../../locators/FormControl.json");
import homePage from "../../../../locators/HomePage";
import * as _ from "../../../../support/Objects/ObjectsCore";

let datasourceName;

describe("Validate Mongo query commands", function () {
  // afterEach(function() {
  //   if (this.currentTest.state === "failed") {
  //     Cypress.runner.stop();
  //   }
  // });

  // afterEach(() => {
  //   if (queryName)
  //     cy.actionContextMenuByEntityName(queryName);
  // });

  before("Creates a new Mongo datasource", function () {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.MongoDB).click();
    cy.fillMongoDatasourceForm();
    cy.generateUUID().then((uid) => {
      datasourceName = `Mongo CRUD ds ${uid}`;
      cy.renameDatasource(datasourceName);
    });
    cy.testSaveDatasource();
  });

  it("1. Validate Raw query command, run and then delete the query", function () {
    cy.NavigateToActiveDSQueryPane(datasourceName);
    // cy.get("@getPluginForm").should(
    //   "have.nested.property",
    //   "response.body.responseMeta.status",
    //   200,
    // );

    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Raw",
    );
    cy.get(queryLocators.templateMenu).click();
    cy.typeValueNValidate(
      '{"find": "listingAndReviews","limit": 10}',
      formControls.rawBody,
    );

    // cy.get(".CodeMirror textarea")
    //   .first()
    //   .focus()
    //   .type(`{"find": "listingAndReviews","limit": 10}`, {
    //     parseSpecialCharSequences: false,
    //   });
    // cy.EvaluateCurrentValue(`{"find": "listingAndReviews","limit": 10}`);

    cy.runQuery();
    _.dataSources.CheckResponseRecordsCount(10);
    cy.deleteQueryUsingContext();
  });

  it("2. Validate Find documents command & Run and then delete the query", function () {
    cy.NavigateToActiveDSQueryPane(datasourceName);
    _.dataSources.SetQueryTimeout(20000);

    //cy.xpath(queryLocators.findDocs).should("exist"); //Verifying update is success or below line
    //cy.expect(queryLocators.findDocs).to.exist;

    _.agHelper.ValidateNetworkStatus("@trigger");
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
    );

    _.dataSources.EnterJSContext({
      fieldProperty: _.dataSources._mongoCollectionPath,
      fieldLabel: "Collection",
      fieldValue: "listingAndReviews",
    });
    _.dataSources.RunQuery();
    _.dataSources.CheckResponseRecordsCount(10);

    _.agHelper.EnterValue("{beds : {$lte: 2}}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });
    _.dataSources.RunQuery();
    _.dataSources.CheckResponseRecordsCount(10);

    _.agHelper.EnterValue("{number_of_reviews: -1}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Sort",
    }); //sort descending
    _.dataSources.RunQuery();
    _.dataSources.CheckResponseRecordsCount(10);

    _.agHelper.EnterValue("{house_rules: 1, description:1}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Projection",
    }); //Projection field
    _.dataSources.RunQuery();

    _.agHelper.EnterValue("5", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Limit",
    }); //Limit field

    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body[0].description).to.contains(
        "The ideal apartment to visit the magnificent city of Porto and the northern region of Portugal, with family or with a couple of friends",
        "Response is not as expected for Find commmand with multiple conditions",
      );
    });
    _.dataSources.CheckResponseRecordsCount(5);

    _.agHelper.EnterValue("2", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Skip",
    });
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body[0].description).to.contains(
        "My place is close to the beach, family-friendly activities, great views, and a short drive to art and culture, and restaurants and dining",
        "Response is not as expected for Find commmand with multiple conditions",
      );
    });
    _.dataSources.CheckResponseRecordsCount(5);
    cy.deleteQueryUsingContext();
  });

  it("3. Validate Count command & Run and then delete the query", function () {
    cy.NavigateToActiveDSQueryPane(datasourceName);
    _.agHelper.ValidateNetworkStatus("@trigger");
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Count",
    );
    _.dataSources.EnterJSContext({
      fieldProperty: _.dataSources._mongoCollectionPath,
      fieldLabel: "Collection",
      fieldValue: "listingAndReviews",
    });
    _.dataSources.RunQuery();
    _.agHelper.EnterValue("{guests_included : {$gte: 2}}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.n).to.be.above(
        0,
        "Response is not as expected for Count commmand",
      );
    });
    cy.deleteQueryUsingContext();
  });

  it("4. Validate Distinct command & Run and then delete the query", function () {
    cy.NavigateToActiveDSQueryPane(datasourceName);
    _.agHelper.ValidateNetworkStatus("@trigger");
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Distinct",
    );
    _.dataSources.EnterJSContext({
      fieldProperty: _.dataSources._mongoCollectionPath,
      fieldLabel: "Collection",
      fieldValue: "listingAndReviews",
    });
    _.agHelper.EnterValue("{price : {$gte: 100}}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });
    _.agHelper.EnterValue("property_type", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Key",
    });
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.values[0]).to.eq(
        "Aparthotel",
        "Response is not as expected for Distint commmand",
      );
    });
    cy.deleteQueryUsingContext();
  });

  it("5. Validate Aggregate command & Run and then delete the query", function () {
    cy.NavigateToActiveDSQueryPane(datasourceName);
    _.agHelper.ValidateNetworkStatus("@trigger");
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Aggregate",
    );
    _.dataSources.EnterJSContext({
      fieldProperty: _.dataSources._mongoCollectionPath,
      fieldLabel: "Collection",
      fieldValue: "listingAndReviews",
    });
    _.agHelper.EnterValue(`[{ $project: { count: { $size:"$amenities" }}}]`, {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Array of pipelines",
    });

    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ request, response }) => {
      // cy.log(request.method + ": is req.method")
      //expect(request.method).to.equal('POST')
      expect(response.body.data.body[0].count).to.be.above(
        0,
        "Response is not as expected for Aggregate commmand",
      );
      // it is good practice to add message to the assertion
      // expect(req, 'has duration in ms').to.have.property('duration').and.be.a('number')
    });
    cy.deleteQueryUsingContext();
  });

  it("6. Verify generation of NewPage from collection [Select] + Bug 12162", function () {
    //Verifying Select from UI
    cy.NavigateToDSGeneratePage(datasourceName);
    cy.get(generatePage.selectTableDropdown).click();
    cy.get(generatePage.dropdownOption)
      //.first()
      .contains("listingAndReviews")
      // .scrollIntoView()
      .should("be.visible")
      .click();

    cy.get(generatePage.generatePageFormSubmitBtn).click();

    cy.wait("@replaceLayoutWithCRUDPage").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );

    cy.wait("@getActions");

    cy.wait("@postExecute").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    ); //This verifies the Select on the table, ie page is created fine

    cy.ClickGotIt();

    //Check if table is loaded & CRUD is success

    cy.get(generatePage.selectedRow).should("exist");
    // cy.get(generatePage.updateBtn)
    //   .closest("button")
    //   .then((selector) => {
    //     cy.get(selector)
    //       .invoke("attr", "class")
    //       .then((classes) => {
    //         cy.log("classes are:" + classes);
    //         expect(classes).not.contain("bp3-disabled");
    //       });
    //   });
  });

  it("7. Validate Deletion of the Newly Created Page", () => {
    cy.NavigateToQueryEditor();
    _.dataSources.DeleteDatasouceFromActiveTab(datasourceName, 409);
    _.entityExplorer.ActionContextMenuByEntityName(
      "ListingAndReviews",
      "Delete",
    );
  });

  it("8. Bug 7399: Validate Form based & Raw command based templates", function () {
    let id;
    _.entityExplorer.ExpandCollapseEntity("Datasources");
    _.entityExplorer.ExpandCollapseEntity(`${datasourceName}`);
    cy.get("[data-testid='t--entity-item-listingAndReviews']")
      .find(".t--template-menu-trigger")
      .click({ force: true });

    cy.get(".ads-v2-menu__menu-item").contains("Find").click().wait(100); //wait for Find form to open

    cy.get(`${formControls.mongoCollection} .rc-select-selection-item`)
      .then(($field) => {
        return cy.wrap($field).invoke("text");
      })
      .then((val) => {
        cy.wrap(val).as("colData");
      });
    cy.EvaluatFieldValue(formControls.mongoFindQuery).then((queryData) => {
      let localqueryData = queryData.replace("{", "").replace("}", "");
      id = localqueryData;
      cy.log("Query value is : " + localqueryData);
      cy.wrap(localqueryData).as("queryData");
    });
    cy.EvaluatFieldValue(formControls.mongoFindSort).then((sortData) => {
      let localsortData = sortData.replace("{", "").replace("}", "");
      cy.log("Sort value is : " + localsortData);
      cy.wrap(localsortData).as("sortData");
    });
    cy.EvaluatFieldValue(formControls.mongoFindLimit).then((limitData) => {
      let locallimitData = limitData.replace("{", "").replace("}", "");
      cy.log("Limit value is : " + locallimitData);
      cy.wrap(locallimitData).as("limitData");
    });

    cy.onlyQueryRun();
    cy.wait(1000);
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.isExecutionSuccess).to.eq(true);
      expect(response.body.data.body[0]._id).to.eq(
        id.split(":")[1].trim().replace(/['"]+/g, ""),
      );
    });

    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Raw",
    );

    cy.EvaluatFieldValue().then((rawData) => {
      rawData = rawData.replace("{", "").replace("}", "");
      cy.log("rawData value is : " + rawData);
      cy.wrap(rawData).as("rawData");
    });

    cy.all(
      cy.get("@colData"),
      cy.get("@queryData"),
      cy.get("@sortData"),
      cy.get("@limitData"),
      cy.get("@rawData"),
    ).then((values) => {
      expect(values[4].trim()).to.contain(values[0].trim());
      expect(values[4].trim()).to.contain(values[1].trim());
      expect(values[4].trim()).to.contain(values[2].trim());
      expect(values[4].trim()).to.contain(values[3].trim());
    });

    cy.onlyQueryRun();
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.isExecutionSuccess).to.eq(true);
      expect(response.body.data.body[0]._id).to.eq(
        id.split(":")[1].trim().replace(/['"]+/g, ""),
      );
    });
    cy.CheckAndUnfoldEntityItem("Queries/JS");
    _.entityExplorer.ActionContextMenuByEntityName("Query1", "Delete");
  });

  it("9. Delete the datasource after NewPage deletion is success", () => {
    cy.NavigateToQueryEditor();
    _.dataSources.DeleteDatasouceFromActiveTab(datasourceName, [200 | 409]);
  });

  it("10. Bug 6375: Cyclic Dependency error occurs and the app crashes when the user generate table and chart from mongo query", function () {
    cy.NavigateToHome();
    cy.get(homePage.createNew).first().click({ force: true });
    cy.wait("@createNewApplication").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
    _.dataSources.CreateDataSource("Mongo");
    cy.generateUUID().then((uid) => {
      datasourceName = `Mongo Documents ${uid}`;
      cy.renameDatasource(datasourceName);
      cy.wrap(datasourceName).as("dSName");
    });

    //Insert documents
    cy.get("@dSName").then((dbName) => {
      cy.NavigateToActiveDSQueryPane(dbName);
    });

    _.agHelper.ValidateNetworkStatus("@trigger");

    _.dataSources.SetQueryTimeout(30000);
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Insert document(s)",
    );

    let nonAsciiDoc = `[{"_id":1, "Från" :"Alen" , "Frõ" :"Active",   "Leverantör":"De Bolster", "Frö":"Basilika - Thai 'Siam Qu_.entityExplorern'"},
    {"_id":2, "Från" :"Joann" , "Frõ" :"Active",   "Leverantör":"De Bolster",   "Frö":"Sallad - Oakleaf 'Salad Bowl'"},
    {"_id":3, "Från" :"Olivia" , "Frõ" :"Active",   "Leverantör":"De Bolster", "Frö":"Sallad - Oakleaf 'Red Salad Bowl'"}]`;

    _.dataSources.EnterJSContext({
      fieldProperty: _.dataSources._mongoCollectionPath,
      fieldLabel: "Collection",
      fieldValue: "NonAsciiTest",
    });

    _.agHelper.EnterValue(nonAsciiDoc, {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Documents",
    });

    cy.getEntityName().then((entity) => {
      cy.wrap(entity).as("entity");
    });
    _.dataSources.RunQuery();

    //Find the Inserted Document
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Insert document(s)",
      "Find document(s)",
    );

    _.dataSources.RunQuery();
    _.dataSources.CheckResponseRecordsCount(3);

    cy.get("@dSName").then((dbName) => {
      //cy.CheckAndUnfoldEntityItem("Datasources");
      _.entityExplorer.ActionContextMenuByEntityName(dbName, "Refresh");
      // cy.get(`.t--entity.datasource:contains(${dbName})`)
      //   .find(explorer.collapse)
      //   .first()
      //   .click();
    });
    cy.xpath("//div[text()='NonAsciiTest']").should("exist");

    //Verifying Suggested Widgets functionality
    cy.get(queryLocators.suggestedTableWidget).click().wait(1000);
    cy.wait("@updateLayout").then(({ response }) => {
      cy.log("1st Response is :" + JSON.stringify(response.body));
      //expect(response.body.data.dsl.children[0].type).to.eq("TABLE_WIDGET");
    });

    cy.CheckAndUnfoldEntityItem("Queries/JS");
    cy.get("@entity").then((entityN) => cy.selectEntityByName(entityN));
    cy.get(queryLocators.suggestedWidgetChart).click().wait(1000);
    cy.wait("@updateLayout").then(({ response }) => {
      cy.log("2nd Response is :" + JSON.stringify(response.body));
      //expect(response.body.data.dsl.children[1].type).to.eq("CHART_WIDGET");
    });

    cy.VerifyErrorMsgAbsence("Cyclic dependency found while evaluating");
    cy.get("@entity").then((entityN) => cy.selectEntityByName(entityN));

    //Update document - Single document
    cy.wait(2000);
    cy.get("body").click(0, 0, { force: true });
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Update document(s)",
    );

    _.agHelper.EnterValue("{_id: {$eq:1}}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });

    _.agHelper.EnterValue("{$set:{ 'Frõ': 'InActive'}}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Update",
    });

    //cy.typeValueNValidate("{_id: {$eq:1}}", formControls.mongoUpdateManyQuery);
    // cy.typeValueNValidate(
    //   "{$set:{ 'Frõ': 'InActive'}}",
    //   formControls.mongoUpdateManyUpdate,
    // );
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.nModified).to.eq(1);
    });

    // //Update document - All matching documents
    // cy.validateNSelectDropdown("Commands", "Find document(s)", "Update document(s)");
    // cy.typeValueNValidate("{_id: {$gte:2}}", "Query");
    // cy.typeValueNValidate("{$set:{ 'Frõ': 'InActive'}}", "Update");
    // cy.validateNSelectDropdown("Limit", "Single document", "All matching documents");
    // cy.runQuery()
    // cy.wait("@postExecute").then(({ response }) => {
    //   expect(response.body.data.body.nModified).to.eq(2);
    // });

    // //Verify Updation Successful:
    // cy.validateNSelectDropdown("Commands", "Update document(s)", "Find document(s)");
    // cy.runQuery()
    // cy.wait("@postExecute").then(({ response }) => {
    //   expect(response.body.data.body[0].Frõ).to.eq('InActive');
    // });

    //Delete documents using both Single & Multiple Documents
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Update document(s)",
      "Delete document(s)",
    );

    _.agHelper.EnterValue("{_id : {$eq: 1 }}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });
    cy.ValidateAndSelectDropdownOption(
      formControls.mongoDeleteLimitDropdown,
      "Single document",
    );
    _.dataSources.RunQuery({ toValidateResponse: false });

    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.n).to.eq(1);
    });

    // cy.typeValueNValidate(
    //   "{_id : {$lte: 3 }}",
    //   formControls.mongoDeleteDocumentsQuery,
    // );
    _.agHelper.EnterValue("{_id : {$lte: 3 }}", {
      propFieldName: "",
      directInput: false,
      inputFieldName: "Query",
    });
    cy.ValidateAndSelectDropdownOption(
      formControls.mongoDeleteLimitDropdown,
      "Single document",
      "All matching documents",
    );
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.n).to.eq(2);
    });

    //Verify Deletion is Successful:
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Delete document(s)",
      "Find document(s)",
    );
    _.dataSources.RunQuery({ toValidateResponse: false });
    cy.wait("@postExecute").then(({ response }) => {
      expect(response.body.data.body.length).to.eq(0); //checking that body is empty array
    });

    //Delete Collection:
    cy.ValidateAndSelectDropdownOption(
      formControls.commandDropdown,
      "Find document(s)",
      "Raw",
    );
    cy.typeValueNValidate('{"drop": "NonAsciiTest"}', formControls.rawBody);
    cy.wait(1000); //Waiting a bit before runing the command
    _.dataSources.RunQuery({ waitTimeInterval: 2000 });
    cy.CheckAndUnfoldEntityItem("Datasources");
    cy.get("@dSName").then((dbName) => {
      _.entityExplorer.ActionContextMenuByEntityName(dbName, "Refresh");
    });
    cy.xpath("//div[text()='NonAsciiTest']").should("not.exist"); //validating drop is successful!
    cy.deleteQueryUsingContext();
  });
});
