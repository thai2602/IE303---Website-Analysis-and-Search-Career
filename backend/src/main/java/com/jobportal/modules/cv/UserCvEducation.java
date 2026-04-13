package com.jobportal.modules.cv;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_cv_educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCvEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private UserCv cv;

    private String school;

    private String major;

    @Column(name = "start_date", length = 20)
    private String startDate;

    @Column(name = "end_date", length = 20)
    private String endDate;
}
