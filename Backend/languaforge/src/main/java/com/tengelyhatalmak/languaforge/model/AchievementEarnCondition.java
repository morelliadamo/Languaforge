package com.tengelyhatalmak.languaforge.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AchievementEarnCondition {
    private String condition;
    private String value;

    public Integer convertValueToInteger(){
        if(this.value.matches("\\d+")){
            return Integer.parseInt(this.value);
        }
        return null;
    }

    public Double convertValueToDecimal(){
        if(this.value.matches("\\d+\\.\\d+")){
            return Double.parseDouble(this.value);
        }
        return null;
    }


}

