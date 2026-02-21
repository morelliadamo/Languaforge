package com.tengelyhatalmak.languaforge.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "store_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;


    private enum Type {
        hearts5,
        hearts10,
        hearts25,
        hints5,
        hints10,
        hints25,
        freeze
    }
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name = "price", nullable = false)
    private Double price;
}
