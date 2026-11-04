package com.zeydem;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

// The arrows of decisions/004-layers.md. Reads the app's compiled classes, not the tests.
@AnalyzeClasses(packages = "com.zeydem", importOptions = ImportOption.DoNotIncludeTests.class)
class LayerRulesTest {

    @ArchTest
    static final ArchRule layersCallOneWay = layeredArchitecture()
            // Only calls between our own layers count; Spring, Java and Lombok are ignored.
            .consideringOnlyDependenciesInLayers()
            // An empty layer is not an error: most of them fill up as ZEY-12 goes on.
            .withOptionalLayers(true)
            .layer("Controller").definedBy("com.zeydem.controller..")
            .layer("Service").definedBy("com.zeydem.service..")
            .layer("Repository").definedBy("com.zeydem.repository..")
            .layer("Domain").definedBy("com.zeydem.domain..")
            .layer("Dto").definedBy("com.zeydem.dto..")
            .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
            .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
            .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service")
            .whereLayer("Domain").mayOnlyBeAccessedByLayers("Service", "Repository")
            .whereLayer("Dto").mayOnlyBeAccessedByLayers("Controller", "Service");
}
